import type { NextFunction, Request, Response } from "express";

/**
 * A small in-process response cache.
 *
 * The rate limiter bounds how fast a client may ask; this bounds how often an
 * answer costs a Firestore read. Both are needed, because the two problems in
 * the logs are different shapes: bursty crawlers (limiter) and clients that
 * proxy the API live per page view without any caching of their own. The
 * clearest example of the second is aoe4analyzer.app, which in 30 days fetched
 * only 205 distinct builds but did so 675 times - the same build up to 39
 * times. A cache turns that into one read per build per TTL no matter what the
 * client does, which a rate limit alone never would.
 *
 * Cache-Control is set alongside, so well-behaved clients and any CDN in front
 * of them stop asking at all. That is the polite half; the store is the half
 * that works regardless.
 *
 * Deliberately not Redis: the working set is a few hundred small JSON payloads
 * and the traffic is ~380 requests/day. In-process means each Cloud Run
 * instance keeps its own copy, so a scaled-out service caches a little less
 * effectively - at this size that costs a handful of reads, not a bill.
 */

type Entry = { body: unknown; expiresAt: number };

/**
 * Bounded so a crawler walking every filter combination cannot grow the heap
 * without limit - 653 distinct combinations in one day is a real number from
 * the logs, not a hypothetical. Insertion-ordered eviction (oldest first), not
 * LRU: at this size the difference is not worth the bookkeeping.
 */
const MAX_ENTRIES = 300;

const store = new Map<string, Entry>();

/** Query order must not create two entries for one answer. */
const cacheKey = (req: Request): string => {
    const params = Object.entries(req.query)
        .map(([k, v]) => [k, String(v)] as const)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${v}`)
        .join("&");
    return params ? `${req.path}?${params}` : req.path;
};

/**
 * @param ttlSeconds how long a 200 response may be reused.
 */
export const cacheFor = (ttlSeconds: number) =>
    (req: Request, res: Response, next: NextFunction): void => {
        if (req.method !== "GET") return next();

        const key = cacheKey(req);
        const now = Date.now();
        const hit = store.get(key);

        if (hit && hit.expiresAt > now) {
            const remaining = Math.max(1, Math.ceil((hit.expiresAt - now) / 1000));
            res.setHeader("Cache-Control", `public, max-age=${remaining}`);
            res.setHeader("X-Cache", "HIT");
            res.json(hit.body);
            return;
        }

        res.setHeader("Cache-Control", `public, max-age=${ttlSeconds}`);
        res.setHeader("X-Cache", "MISS");

        // Capture on the way out. Only 200s are stored: a 400 from a bad civ
        // code costs no Firestore read (tsoa rejects before the controller
        // runs), and a 404 must not be remembered for a build that is about to
        // be published.
        const sendJson = res.json.bind(res);
        res.json = (body: unknown) => {
            if (res.statusCode === 200) {
                if (store.size >= MAX_ENTRIES) {
                    const oldest = store.keys().next().value;
                    if (oldest !== undefined) store.delete(oldest);
                }
                store.set(key, { body, expiresAt: Date.now() + ttlSeconds * 1000 });
            }
            return sendJson(body);
        };

        next();
    };
