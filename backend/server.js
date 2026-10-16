import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    message: "chatbot api server",
    version: "1.0.0",
  });
});

app.listen(PORT, () => console.log("Server running"));
