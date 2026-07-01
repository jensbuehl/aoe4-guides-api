import cors, { CorsOptions } from "cors";
import express from "express";
import { serve, setup } from "swagger-ui-express";
import { RegisterRoutes } from "./generated/routes";
import swaggerDocument from "../public/swagger.json";

const app = express();
const port = process.env.PORT || 8080;
const corsOptions: CorsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
    optionsSuccessStatus: 200
};

app.use(express.json());
app.use(cors(corsOptions));

// Registering all routes through the controllers
RegisterRoutes(app);

app.use("/api-docs", serve, setup(swaggerDocument, {
    swaggerOptions: {
        persistAuthorization: false,
    }
}));

app.listen(port, () => console.log("Listening on port", port));
