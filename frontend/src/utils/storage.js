const KEY = "lab11_tareas_v1";

export function loadTareas() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error cargando tareas:", e);
    return [];
  }
}

export function saveTareas(tareas) {
  try {
    localStorage.setItem(KEY, JSON.stringify(tareas));
  } catch (e) {
    console.error("Error guardando tareas:", e);
  }
}
