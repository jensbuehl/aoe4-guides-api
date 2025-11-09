import cors, { CorsOptions } from "cors";
import express from "express";
import { serve, setup } from "swagger-ui-express";
import { RegisterRoutes } from "./generated/routes";
import swaggerDocument from "../public/swagger.json";

const app = express();
const port = process.env.PORT || 8080;
const corsOptions: CorsOptions = {
    origin: "*",
    optionsSuccessStatus: 200
};

app.use(express.json());
app.use(cors(corsOptions));

// Registering all routes through the controllers
RegisterRoutes(app);

app.use("/api-docs", serve, setup(swaggerDocument));

app.listen(port, () => console.log("Listening on port", port));
