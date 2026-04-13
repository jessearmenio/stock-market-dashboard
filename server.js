import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { createClient } from "@libsql/client";

const app = express();

app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:5500", // adjust if needed
  ]
}));

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// test route
app.get("/", (_req, res) => {
  res.send("API is running");
});
app.get("/api/health", async (_req, res) => {
  try {
    const result = await db.execute("SELECT 1 as ok");
    res.json({ ok: true, db: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});