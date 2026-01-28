import React, { useState, useEffect } from "react";
import "../../styles/animo.css";
import { crearRegistroAnimo, obtenerRegistrosAnimo, RegistroAnimo as RegistroAnimoType } from "../../services/registroAnimo";

const opcionesEstado = ["Feliz", "Triste", "Preocupado", "Cansado", "Enojado", "Neutral"];

const RegistroAnimo: React.FC = () => {
  const [estado, setEstado] = useState<string>(opcionesEstado[0]);
  const [motivo, setMotivo] = useState<string>("");
  const [observaciones, setObservaciones] = useState<string>("");
  const [registros, setRegistros] = useState<RegistroAnimoType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [enviado, setEnviado] = useState<boolean>(false);

  useEffect(() => {
    cargarRegistros();
  }, []);

  const cargarRegistros = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const perfilJson = localStorage.getItem('usuario_perfil');
      if (!perfilJson) {
        setError('Usuario no encontrado');
        return;
      }
      
      const perfil = JSON.parse(perfilJson);
      const registrosData = await obtenerRegistrosAnimo(perfil.id);
      setRegistros(registrosData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar registros');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEstado(opcionesEstado[0]);
    setMotivo("");
    setObservaciones("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const perfilJson = localStorage.getItem('usuario_perfil');
      if (!perfilJson) {
        setError('Usuario no encontrado');
        return;
      }
      
      const perfil = JSON.parse(perfilJson);
      
      const nuevoRegistro = await crearRegistroAnimo({
        usuario_id: perfil.id,
        fecha: new Date().toISOString(),
        estado: estado as 'Feliz' | 'Triste' | 'Preocupado' | 'Cansado' | 'Enojado' | 'Neutral',
        motivo: motivo,
        observaciones: observaciones,
      });

      if (nuevoRegistro) {
        setRegistros([nuevoRegistro, ...registros]);
        resetForm();
        setError(null);
        setEnviado(true);
        setTimeout(() => setEnviado(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Error al guardar registro');
    }
  };

  return (
    <div className="home-container">
      <h2>Registro de Estado Anímico</h2>

      {enviado && <div style={{backgroundColor: '#22c55e', color: 'white', padding: '1rem', borderRadius: '4px', marginBottom: '1rem'}}>✅ Registro guardado correctamente</div>}
      {error && <div style={{backgroundColor: '#ef4444', color: 'white', padding: '1rem', borderRadius: '4px', marginBottom: '1rem'}}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div>
            <label>Estado emocional</label>
            <select value={estado} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEstado(e.target.value)}>
              {opcionesEstado.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, minWidth: 220 }}>
            <label>Motivo</label>
            <input value={motivo} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMotivo(e.target.value)} placeholder="Breve motivo" />
          </div>

          <div style={{ flexBasis: "100%" }}>
            <label>Observaciones adicionales</label>
            <textarea value={observaciones} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setObservaciones(e.target.value)} rows={3} placeholder="Detalles opcionales" />
          </div>

          <div>
            <button type="submit" className="btn-primary">Registrar</button>
          </div>
        </div>
      </form>

      <h3>Registros recientes</h3>
      {loading && <p>Cargando registros...</p>}
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
                <td>{new Date(r.fecha).toLocaleString('es-ES')}</td>
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
