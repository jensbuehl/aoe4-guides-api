import cors, { CorsOptions } from "cors";
import express from "express";
import { serve, setup } from "swagger-ui-express";
import { RegisterRoutes } from "./generated/routes";
import swaggerDocument from "../public/swagger.json";
import { cacheFor } from "./middleware/cache";
import { idHourlyLimiter, idLimiter, listHourlyLimiter, listLimiter } from "./middleware/rateLimit";

const app = express();
const port = process.env.PORT || 8080;
const corsOptions: CorsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
    optionsSuccessStatus: 200
};

/**
 * Trust exactly one proxy hop, so the rate limiter buckets on the real caller.
 *
 * Cloud Run appends the connecting address to whatever X-Forwarded-For the
 * client sent, so the trustworthy entry is the rightmost one - and trusting a
 * single hop is what makes express read it from that end. A client that forges
 * the header therefore only pushes its own fake value further left, where it is
 * ignored.
 *
 * The accepted cost: requests reaching the service through aoe4guides.com/api
 * (Netlify proxies /api/* to this URL) all bucket under Netlify's egress
 * address rather than the visitor's. That path carried ~85 requests a day in
 * the measured month against a limit of 30/minute, so sharing one bucket is
 * comfortable - but it is the reason the limits below are not tighter.
 */
app.set("trust proxy", 1);

app.use(express.json());
app.use(cors(corsOptions));

// Guards run before the generated routes and fall through to them. Each list
// call returns 10 documents and each by-id call returns one, which is why they
// are limited and cached separately. /status and / stay unguarded so health
// checks always answer.
app.get("/builds", listLimiter, listHourlyLimiter, cacheFor(60));
app.get("/favorites/:userId", listLimiter, listHourlyLimiter, cacheFor(60));
app.get("/builds/:buildId", idLimiter, idHourlyLimiter, cacheFor(300));

// Registering all routes through the controllers
RegisterRoutes(app);

app.use("/api-docs", serve, setup(swaggerDocument, {
    swaggerOptions: {
        persistAuthorization: false,
    }
}));

app.listen(port, () => console.log("Listening on port", port));
