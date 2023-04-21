import express, { Express } from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import {
  createDelivery,
  getDeliveries,
  getDeliveryByID,
} from "./routes/deliveries";
import {
  assignBotsToDeliveries,
  createBot,
  getBotsByZone,
} from "./routes/bots";
import DatabaseService from "./db/db";

// Load configuration from .env file
// See example.env for an example .env file
dotenv.config();

export const db = new DatabaseService();
const app: Express = express();
const port = process.env.PORT;

app.use(express.json());

// Expose Swagger docs
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(YAML.load("./swagger.yaml"))
);

// Routes for the application

app.post("/deliveries", createDelivery);

app.get("/deliveries", getDeliveries);

app.get("/deliveries/:id", getDeliveryByID);

app.post("/bots", createBot);

app.get("/bots/:zone", getBotsByZone);

app.post("/bots/:zone/assign", assignBotsToDeliveries);

app.listen(port, () => {
  console.log(
    `⚡️[Kiwibot]⚡️: Delivery service is running at http://localhost:${port}`
  );
});
