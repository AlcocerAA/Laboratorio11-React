import React, { useState } from "react";

function TareaForm({ onAdd }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      setError("No puedes agregar una tarea vacía.");
      return;
    }
    if (trimmed.length > 120) {
      setError("La tarea no puede tener más de 120 caracteres.");
      return;
    }
    onAdd(trimmed);
    setText("");
    setError("");
  }

  return (
    <form className="tarea-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Escribe una nueva tarea..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={200}
      />
      <button type="submit">Agregar</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}

export default TareaForm;