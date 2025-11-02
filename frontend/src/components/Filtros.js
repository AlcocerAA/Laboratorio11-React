import React from "react";

function Filtros({ filtroActual, setFiltro, ordenarAsc, toggleOrden }) {
  return (
    <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8}}>
      <div className="filtros">
        <button onClick={() => setFiltro("Todas")} className={filtroActual==="Todas" ? "active" : ""}>Todas</button>
        <button onClick={() => setFiltro("Pendientes")} className={filtroActual==="Pendientes" ? "active" : ""}>Pendientes</button>
        <button onClick={() => setFiltro("Completadas")} className={filtroActual==="Completadas" ? "active" : ""}>Completadas</button>
      </div>
      <div>
        <button onClick={toggleOrden} className="small">Orden: {ordenarAsc ? "Asc" : "Desc"}</button>
      </div>
    </div>
  );
}

export default Filtros;
