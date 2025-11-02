import { useEffect, useMemo, useState } from "react";
import { fetchTasks, createTask, updateTaskText, toggleTask, deleteTask } from "./api";
import TareaForm from "./components/TareaForm";
import ListaTareas from "./components/ListaTareas";
import Filtros from "./components/Filtros";

export default function App() {
  const [tareas, setTareas] = useState([]);
  const [filtro, setFiltro] = useState("Todas");
  const [ordenAsc, setOrdenAsc] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchTasks();
        setTareas(data);
      } catch {
        setError("No se pudieron cargar las tareas.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function addTarea(texto) {
    const t = texto.trim();
    if (!t) return setError("No puedes agregar una tarea vacía.");
    if (t.length > 120) return setError("Máx 120 caracteres.");
    try {
      const nueva = await createTask(t);
      setTareas(prev => [nueva, ...prev]);
      setError("");
    } catch {
      setError("Error creando tarea.");
    }
  }

  async function editTarea(id, nuevoTexto) {
    const t = nuevoTexto.trim();
    if (!t) return setError("La tarea no puede quedar vacía.");
    if (t.length > 120) return setError("Máx 120 caracteres.");
    try {
      const updated = await updateTaskText(id, t);
      setTareas(prev => prev.map(x => (x.id === id ? updated : x)));
      setError("");
    } catch {
      setError("Error editando tarea.");
    }
  }

  async function toggleCompletada(id) {
    try {
      const updated = await toggleTask(id);
      setTareas(prev => prev.map(x => (x.id === id ? updated : x)));
    } catch {
      setError("Error cambiando estado.");
    }
  }

  async function borrarTarea(id) {
    try {
      await deleteTask(id);
      setTareas(prev => prev.filter(x => x.id !== id));
    } catch {
      setError("Error eliminando tarea.");
    }
  }

  const filtered = useMemo(() => {
    let res = tareas;
    if (filtro === "Pendientes") res = res.filter(t => !t.completed);
    if (filtro === "Completadas") res = res.filter(t => t.completed);
    return res.slice().sort((a, b) => (ordenAsc ? a.createdAt - b.createdAt : b.createdAt - a.createdAt));
  }, [tareas, filtro, ordenAsc]);

  return (
    <div className="app">
      <div className="header">
        <div>
          <h1>Lista de Tareas</h1>
          <p className="muted">Persistencia en SQLite vía API</p>
        </div>
        <div className="small">Orden: {ordenAsc ? "Asc" : "Desc"}</div>
      </div>

      {/* Card formulario + filtros */}
      <div className="card rgb">
        <TareaForm onAdd={addTarea} />
        <div className="row" style={{ marginTop: 10, justifyContent: "space-between" }}>
          <Filtros filtroActual={filtro} setFiltro={setFiltro} />
          {/* Mantenemos SOLO este botón de orden */}
          <button className="btn-editar" onClick={() => setOrdenAsc(s => !s)}>
            Cambiar orden ({ordenAsc ? "Asc" : "Desc"})
          </button>
        </div>
        {error && <div className="error">{error}</div>}
      </div>

      {/* Card lista */}
      <div className="card rgb">
        {loading ? (
          <div className="small">Cargando…</div>
        ) : (
          <ListaTareas
            tareas={filtered}
            onDelete={borrarTarea}
            onEdit={editTarea}
            onToggle={toggleCompletada}
          />
        )}
      </div>
    </div>
  );
}
