import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = process.env.DB_PATH || path.join(__dirname, "data", "tasks.sqlite");

// Asegura carpeta data/
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

export const db = new Database(DB_PATH);

// Migración
const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
db.exec(schema);

// Statements preparados
export const statements = {
  list: db.prepare("SELECT id, text, completed, created_at FROM tasks ORDER BY created_at DESC"),
  get: db.prepare("SELECT id, text, completed, created_at FROM tasks WHERE id = ?"),
  insert: db.prepare("INSERT INTO tasks (id, text, completed, created_at) VALUES (?, ?, ?, ?)"),
  updateText: db.prepare("UPDATE tasks SET text = ? WHERE id = ?"),
  toggle: db.prepare("UPDATE tasks SET completed = ? WHERE id = ?"),
  delete: db.prepare("DELETE FROM tasks WHERE id = ?")
};
