import express from "express";
import travelRouter from "./routes/travel.js";
import conversationRouter from "./routes/conversation.js";
import cors from "cors";
import dotenv from "dotenv";
import compression from "compression";
import { errorHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { logger, logRequest } from "./utils/logger.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

app.use(compression());
app.use(express.json());
app.use(cors());
app.use(apiLimiter);
app.use(logRequest);
app.use("/api/travel", travelRouter);
app.use("/api/conversation", conversationRouter);

app.get("/api/heartbeat", (req, res) => {
  res.json({ message: "服务器正常运行", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server started at http://localhost:${port}`);
});
