import React, { useMemo, useState, useEffect } from "react";
import "../../styles/home.css";
import "../../styles/historial.css";

// Persistencia en localStorage: la clave usada es `sesiones_<userId>` o `sesiones` si no hay userId

type Sesion = {
  id: string;
  fecha: string; // ISO
  duracionMin: number;
  tipo: string;
  responsable: string;
  notas: string;
  estado: string;
};

const datosIniciales: Sesion[] = [
  { id: "1", fecha: new Date().toISOString(), duracionMin: 30, tipo: "Teleconsulta", responsable: "Dra. María Gómez", notas: "Revisión de medicación", estado: "Completada" },
  { id: "2", fecha: new Date().toISOString(), duracionMin: 20, tipo: "Monitoreo", responsable: "Enfermero: Juan Pérez", notas: "Lecturas de TA/FC", estado: "Completada" }
];

const formatosFecha = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString();
};

const HistorialSesiones: React.FC = () => {
  const [sesiones, setSesiones] = useState<Sesion[]>(datosIniciales);
  const [tipoFiltro, setTipoFiltro] = useState<string>("Todas");
  const [desde, setDesde] = useState<string>("");
  const [hasta, setHasta] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cargar sesiones desde localStorage
    setLoading(true);
    setError(null);
    try {
      const userId = localStorage.getItem("userId");
      const key = userId ? `sesiones_${userId}` : "sesiones";
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as Sesion[];
        setSesiones(parsed.sort((a, b) => +new Date(b.fecha) - +new Date(a.fecha)));
      } else {
        // usar datos iniciales si no hay nada guardado
        setSesiones(datosIniciales);
      }
    } catch (err: any) {
      setError("Error leyendo sesiones desde localStorage");
      setSesiones(datosIniciales);
    } finally {
      setLoading(false);
    }
  }, []);

  const tipos = useMemo(() => {
    const s = new Set<string>(sesiones.map((x) => x.tipo));
    return ["Todas", ...Array.from(s)];
  }, [sesiones]);

  const filtradas = useMemo(() => {
    return sesiones.filter((s) => {
      const f = new Date(s.fecha);
      if (tipoFiltro !== "Todas" && s.tipo !== tipoFiltro) return false;
      if (desde) {
        const d = new Date(desde);
        if (f < d) return false;
      }
      if (hasta) {
        const h = new Date(hasta);
        // incluir día completo
        h.setHours(23, 59, 59, 999);
        if (f > h) return false;
      }
      return true;
    });
  }, [sesiones, tipoFiltro, desde, hasta]);

  return (
    <div className="home-container">
      <h2>Historial de Sesiones de Teleasistencia</h2>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <div>
          <label>Desde</label>
          <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
        </div>
        <div>
          <label>Hasta</label>
          <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
        </div>
        <div>
          <label>Categoría</label>
          <select value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)}>
            {tipos.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p>Cargando sesiones...</p>}
      {error && <p style={{ color: "#b91c1c" }}>{error}</p>}

      <div style={{ overflowX: "auto" }}>
        <table className="historial-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Duración</th>
              <th>Categoría</th>
              <th>Responsable</th>
              <th>Notas</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 12 }}>
                  No hay sesiones que coincidan con los filtros.
                </td>
              </tr>
            )}
            {filtradas.map((s) => (
              <tr key={s.id}>
                <td>{formatosFecha(s.fecha)}</td>
                <td>{s.duracionMin} min</td>
                <td>{s.tipo}</td>
                <td>{s.responsable}</td>
                <td>{s.notas}</td>
                <td>{s.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistorialSesiones;
