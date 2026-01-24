import React, { useState, useEffect } from "react";
import "../../styles/animo.css";

// Persistencia en localStorage: clave `registro_animo_<userId>` o `registro_animo`

type Registro = {
  id: string;
  fecha: string;
  estado: string;
  motivo: string;
  observaciones: string;
};

const opcionesEstado = ["Feliz", "Triste", "Preocupado", "Cansado", "Enojado", "Neutral"];

const RegistroAnimo: React.FC = () => {
  const [estado, setEstado] = useState<string>(opcionesEstado[0]);
  const [motivo, setMotivo] = useState<string>("");
  const [observaciones, setObservaciones] = useState<string>("");
  const [registros, setRegistros] = useState<Registro[]>(() => []);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      const userId = localStorage.getItem("userId");
      const key = userId ? `registro_animo_${userId}` : "registro_animo";
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as Registro[];
        setRegistros(parsed.sort((a, b) => +new Date(b.fecha) - +new Date(a.fecha)));
      } else {
        setRegistros([]);
      }
    } catch (err: any) {
      setError("Error leyendo registros desde localStorage");
      setRegistros([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetForm = () => {
    setEstado(opcionesEstado[0]);
    setMotivo("");
    setObservaciones("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevo: Registro = {
      id: Date.now().toString(),
      fecha: new Date().toISOString(),
      estado,
      motivo,
      observaciones,
    };
    try {
      const userId = localStorage.getItem("userId");
      const key = userId ? `registro_animo_${userId}` : "registro_animo";
      const almacenadosRaw = localStorage.getItem(key);
      const almacenados = almacenadosRaw ? (JSON.parse(almacenadosRaw) as Registro[]) : [];
      const nuevos = [nuevo, ...almacenados];
      localStorage.setItem(key, JSON.stringify(nuevos));
      setRegistros(nuevos);
      resetForm();
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error al guardar en localStorage");
    }
  };

  return (
    <div className="home-container">
      <h2>Registro de Estado Anímico</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div>
            <label>Estado emocional</label>
            <select value={estado} onChange={(e) => setEstado(e.target.value)}>
              {opcionesEstado.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, minWidth: 220 }}>
            <label>Motivo</label>
            <input value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Breve motivo" />
          </div>

          <div style={{ flexBasis: "100%" }}>
            <label>Observaciones adicionales</label>
            <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)} rows={3} placeholder="Detalles opcionales" />
          </div>

          <div>
            <button type="submit" className="btn-primary">Registrar</button>
          </div>
        </div>
      </form>

      <h3>Registros recientes</h3>
      {loading && <p>Cargando registros...</p>}
      {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
      <div style={{ overflowX: "auto" }}>
        <table className="historial-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Motivo</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {registros.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: 12 }}>Aún no hay registros.</td>
              </tr>
            )}
            {registros.map((r) => (
              <tr key={r.id}>
                <td>{new Date(r.fecha).toLocaleString()}</td>
                <td>{r.estado}</td>
                <td>{r.motivo}</td>
                <td>{r.observaciones}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegistroAnimo;
