import express from "express";
const router = express.Router();

router.post("/travel", (req, res) => {
  res.json({
    message: "Recommend Travel",
    timeStamp: new Date().toISOString(),
  });
});

router.post("/chat", (req, res) => {
  res.json({ message: "Chat Travel", timeStamp: new Date().toISOString() });
});

export default router;