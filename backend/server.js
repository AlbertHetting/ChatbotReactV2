import express from "express";
import cors from "cors";
import sql from "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/", (req, res) => {
  res.json({
    message: "chatbot api server",
    version: "1.0.0",
  });
});

app.get("/api/threads", async (req, res) => {
  try {
    const threads = await sql`
  SELECT id, title, created_at
  FROM threads
  ORDER BY created_at DESC
  `;

    res.json(threads);
  } catch (error) {
    console.error("error fetching threads", error);

    res.status(500).json({
      error: "Failed to fetch threads from database server error",
    });
  }
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`),
);
