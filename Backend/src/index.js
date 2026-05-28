import express from "express";
import travelRouter from "./routes/travel.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use("/api/travel", travelRouter);

app.get("/api/heartbeat", (req, res) => {
  res.json({ message: "服务器正常运行", timestamp: Date.now().toISOString() });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});