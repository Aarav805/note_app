import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { notesRouter } from "./routes/notes.js";
import "./db.js"; // ensures tables are created on startup

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.use("/api/notes", notesRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
