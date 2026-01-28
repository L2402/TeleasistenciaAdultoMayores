import React, { useState, useEffect } from 'react';
import '../../styles/registroUsuario.css';
import { crearIncidencia, obtenerIncidencias, Incidencia } from '../../services/incidencias';

const categorias = [
  { value: 'tecnico', label: 'Problema técnico' },
  { value: 'consulta', label: 'Consulta' },
  { value: 'queja', label: 'Queja' },
  { value: 'otro', label: 'Otro' }
];

const Incidencias: React.FC = () => {
  const [form, setForm] = useState({ categoria: 'tecnico', descripcion: '' });
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [cargando, setCargando] = useState(true);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        const perfilJson = localStorage.getItem('usuario_perfil');
        if (!perfilJson) return;
        
        const perfil = JSON.parse(perfilJson);
        const data = await obtenerIncidencias(perfil.id);
        setIncidencias(data);
      } catch (err) {
        console.error('Error al cargar incidencias:', err);
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.descripcion.trim()) {
      setError('Por favor, describe la incidencia');
      return;
    }

    try {
      const perfilJson = localStorage.getItem('usuario_perfil');
      if (!perfilJson) {
        setError('Usuario no encontrado');
        return;
      }
      
      const perfil = JSON.parse(perfilJson);
      
      const nueva = await crearIncidencia({
        usuario_id: perfil.id,
        tipo: form.categoria,
        descripcion: form.descripcion,
      });

      if (nueva) {
        setIncidencias([nueva, ...incidencias]);
        setEnviado(true);
        setForm({ categoria: 'tecnico', descripcion: '' });
        setTimeout(() => setEnviado(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Error al enviar incidencia');
    }
  };

  return (
    <div className="registro-container">
      <h2 className="registro-title">Registro de Incidencias o Problemas</h2>
      <div className="registro-card">
        {enviado && <div className="success-message">✅ Incidencia enviada correctamente</div>}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Categoría</label>
            <select name="categoria" value={form.categoria} onChange={handleChange}>
              {categorias.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={6} placeholder="Describe el problema con la mayor claridad posible" />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-primary" type="submit">Enviar</button>
            <button className="btn-secondary" type="button" onClick={() => setForm({ categoria: 'tecnico', descripcion: '' })}>Limpiar</button>
          </div>
        </form>

        <h3 style={{ marginTop: '2rem' }}>Mis Incidencias</h3>
        {cargando && <p>Cargando...</p>}
        {incidencias.length === 0 && !cargando && <p>No hay incidencias registradas</p>}
        
        <div style={{ marginTop: '1rem' }}>
          {incidencias.map((inc) => (
            <div key={inc.id} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
              backgroundColor: '#f9f9f9'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{inc.tipo}</span>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  backgroundColor: inc.estado === 'abierta' ? '#fef3c7' : inc.estado === 'resuelta' ? '#d1fae5' : '#ddd',
                  color: inc.estado === 'abierta' ? '#92400e' : inc.estado === 'resuelta' ? '#065f46' : '#333'
                }}>
                  {inc.estado}
                </span>
              </div>
              <p style={{ margin: '0.5rem 0', color: '#555' }}>{inc.descripcion}</p>
              <p style={{ fontSize: '0.85rem', color: '#888', margin: 0 }}>
                {new Date(inc.created_at).toLocaleString('es-ES')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Incidencias;
