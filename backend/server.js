import "dotenv/config";
import express from "express";
import cors from "cors";
import crypto from "crypto";
import { db, statements } from "./db.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: true })); // permite peticiones desde tu React
app.use(express.json());

// ---- Rutas ----

// Listar
app.get("/tasks", (req, res) => {
  const rows = statements.list.all();
  res.json(rows.map(r => ({ 
    id: r.id, text: r.text, completed: !!r.completed, createdAt: r.created_at 
  })));
});

// Crear
app.post("/tasks", (req, res) => {
  const text = (req.body?.text || "").trim();
  if (!text) return res.status(400).json({ error: "Text required" });
  if (text.length > 120) return res.status(400).json({ error: "Max 120 chars" });

  const id = crypto.randomUUID();
  const createdAt = Date.now();
  statements.insert.run(id, text, 0, createdAt);
  res.status(201).json({ id, text, completed: false, createdAt });
});

// Editar texto
app.patch("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const text = (req.body?.text || "").trim();
  if (!text) return res.status(400).json({ error: "Text required" });
  if (text.length > 120) return res.status(400).json({ error: "Max 120 chars" });

  const existing = statements.get.get(id);
  if (!existing) return res.status(404).json({ error: "Not found" });

  statements.updateText.run(text, id);
  res.json({ id, text, completed: !!existing.completed, createdAt: existing.created_at });
});

// Toggle completado
app.post("/tasks/:id/toggle", (req, res) => {
  const { id } = req.params;
  const row = statements.get.get(id);
  if (!row) return res.status(404).json({ error: "Not found" });

  const next = row.completed ? 0 : 1;
  statements.toggle.run(next, id);
  res.json({ id, text: row.text, completed: !!next, createdAt: row.created_at });
});

// Eliminar
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const info = statements.delete.run(id);
  if (info.changes === 0) return res.status(404).json({ error: "Not found" });
  res.status(204).end();
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
