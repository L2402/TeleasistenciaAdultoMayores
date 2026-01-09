import React, { useState } from 'react';
import '../../styles/registroUsuario.css';

const categorias = [
  { value: 'tecnico', label: 'Problema técnico' },
  { value: 'consulta', label: 'Consulta' },
  { value: 'queja', label: 'Queja' },
  { value: 'otro', label: 'Otro' }
];

const Incidencias: React.FC = () => {
  const [form, setForm] = useState({ categoria: 'tecnico', descripcion: '' });
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.descripcion.trim()) {
      setError('Por favor, describe la incidencia');
      return;
    }

    // TODO: enviar a backend/Supabase
    console.log('Incidencia registrada:', form);
    setEnviado(true);
    setForm({ categoria: 'tecnico', descripcion: '' });
    setTimeout(() => setEnviado(false), 3000);
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
      </div>
    </div>
  );
};

export default Incidencias;
