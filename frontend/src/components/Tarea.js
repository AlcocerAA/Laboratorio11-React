import React, { useState } from "react";

function Tarea({ tareaObj, onDelete, onEdit, onToggle }) {
  const { id, texto, completada, createdAt } = tareaObj;
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState(texto);

  function handleSave() {
    const trimmed = edited.trim();
    if (!trimmed) {
      alert("La tarea no puede quedar vacía.");
      return;
    }
    if (trimmed.length > 120) {
      alert("Máx 120 caracteres.");
      return;
    }
    onEdit(id, trimmed);
    setIsEditing(false);
  }

  return (
    <li>
      <input
        type="checkbox"
        checked={completada}
        onChange={() => onToggle(id)}
      />
      <div className="tarea-text">
        {isEditing ? (
          <>
            <input
              type="text"
              value={edited}
              onChange={(e) => setEdited(e.target.value)}
            />
          </>
        ) : (
          <div className={completada ? "completada" : ""}>
            {texto}
            <div className="small">Creada: {new Date(createdAt).toLocaleString()}</div>
          </div>
        )}
      </div>

      <div className="tarea-actions">
        {isEditing ? (
          <>
            <button className="btn-guardar" onClick={handleSave}>Guardar</button>
            <button onClick={() => { setIsEditing(false); setEdited(texto); }}>Cancelar</button>
          </>
        ) : (
          <>
            <button className="btn-editar" onClick={() => setIsEditing(true)}>Editar</button>
            <button className="btn-eliminar" onClick={() => onDelete(id)}>Eliminar</button>
          </>
        )}
      </div>
    </li>
  );
}

export default Tarea;