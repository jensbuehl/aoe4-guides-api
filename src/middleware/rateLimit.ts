import { rateLimit } from "express-rate-limit";
import type { Request, Response } from "express";

/**
 * Per-IP rate limits.
 *
 * The numbers come from 30 days of Cloud Run request logs (22.07.-21.08.2026),
 * not from a rule of thumb. For scale: the whole service serves ~380 requests
 * per day, the busiest single day was 1541, and the busiest legitimate client
 * (aoe4guides.com's own App Check fallback, proxied through Netlify) peaked at
 * 298 requests in a day. Everything below is an order of magnitude above real
 * use and only bites bursts.
 *
 * What this does and does not achieve, so nobody mistakes it for a wall:
 *
 * - It bounds bursts. The two clients that mattered - a Python-urllib crawler
 *   that walked 653 distinct filter combinations in a single day, and
 *   "RTSLytics" with 1009 requests in a day from one address - both worked in
 *   concentrated runs and would now be capped.
 * - It does not stop a slow, patient crawl, and it cannot: every build id is
 *   public in sitemap.xml (4202 of them) because the site wants them indexed.
 * - The store is in-process, so the effective limit is multiplied by the number
 *   of running instances. Traffic this small normally runs on one, but a
 *   traffic spike that scales out also loosens the limit. A shared store
 *   (Redis/Memorystore) is the fix if that ever matters; it is not worth a
 *   monthly bill today.
 */

/** Shared response for anything that trips a limit. */
const limitHandler = (_req: Request, res: Response) => {
    res.status(429).json({
        message: "Too many requests. This API is free and unauthenticated - " +
            "please cache responses and keep request rates modest.",
    });
};

// draft-8 rather than the older boolean: two limiters guard the same route, and
// only the named-policy format lets both appear in the response. With the
// draft-6/7 headers the second limiter simply overwrites the first, so a client
// reading them would see the hourly budget and never learn about the tighter
// per-minute one it is actually hitting.
const common = {
    standardHeaders: "draft-8" as const,
    legacyHeaders: false,
    handler: limitHandler,
};

/**
 * List endpoints (`/builds`, `/favorites/{userId}`). One call returns 10
 * documents, so this is where the read amplification lives: list calls
 * accounted for roughly 44k of the ~48k Firestore document reads served in the
 * measured month.
 */
export const listLimiter = rateLimit({
    ...common,
    identifier: "list-per-minute",
    windowMs: 60 * 1000,
    limit: 30,
});

export const listHourlyLimiter = rateLimit({
    ...common,
    identifier: "list-per-hour",
    windowMs: 60 * 60 * 1000,
    limit: 300,
});

/**
 * Single-document reads (`/builds/{id}`). Deliberately looser: this is what
 * legitimate integrations use - RTS Overlay made 503 requests in the measured
 * month and every single one was a by-id read - and it costs one document read
 * per call.
 */
export const idLimiter = rateLimit({
    ...common,
    identifier: "build-per-minute",
    windowMs: 60 * 1000,
    limit: 120,
});

export const idHourlyLimiter = rateLimit({
    ...common,
    identifier: "build-per-hour",
    windowMs: 60 * 60 * 1000,
    limit: 1200,
});
