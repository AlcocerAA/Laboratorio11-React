import React, { useState } from "react";

function TareaItem({ tarea, onDelete, onEdit, onToggle }) {
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState(tarea.text);

  const save = () => {
    const v = edited.trim();
    if (!v) { alert("La tarea no puede quedar vacía."); return; }
    if (v.length > 120) { alert("Máx 120 caracteres."); return; }
    onEdit(tarea.id, v);
    setIsEditing(false);
  };

  return (
    <li className="fade-in">
      <input
        type="checkbox"
        checked={tarea.completed}
        onChange={() => onToggle(tarea.id)}
      />

      <div className="tarea-text">
        {isEditing ? (
          <input
            type="text"
            value={edited}
            onChange={(e) => setEdited(e.target.value)}
          />
        ) : (
          <>
            <div className={tarea.completed ? "completada" : ""}>
              {tarea.text}
            </div>
            <div className="meta small">
              Creada: {new Date(tarea.createdAt).toLocaleString()}
            </div>
          </>
        )}
      </div>

      <div className="tarea-actions">
        {isEditing ? (
          <>
            <button className="btn-guardar" onClick={save}>Guardar</button>
            <button onClick={() => { setIsEditing(false); setEdited(tarea.text); }}>Cancelar</button>
          </>
        ) : (
          <>
            <button className="btn-editar" onClick={() => setIsEditing(true)}>Editar</button>
            <button className="btn-eliminar" onClick={() => onDelete(tarea.id)}>Eliminar</button>
          </>
        )}
      </div>
    </li>
  );
}

export default function ListaTareas({ tareas, onDelete, onEdit, onToggle }) {
  if (!tareas.length) return <div className="empty">No hay tareas aún.</div>;

  return (
    <ul className="lista-tareas">
      {tareas.map((t) => (
        <TareaItem
          key={t.id}
          tarea={t}
          onDelete={onDelete}
          onEdit={onEdit}
          onToggle={onToggle}
        />
      ))}
    </ul>
  );
}
