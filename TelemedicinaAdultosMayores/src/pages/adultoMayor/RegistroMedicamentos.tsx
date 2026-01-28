import React, { useState, useEffect } from 'react';
import '../../styles/registroUsuario.css';
import { crearMedicamento, obtenerMedicamentos, desactivarMedicamento, Medicamento } from '../../services/medicamentos';

const RegistroMedicamentos: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    dosis: '',
    frecuencia: 'Diario',
    horarios: '',
    duracion: '',
    unidad: 'días',
    indicaciones: ''
  });

  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [enviado, setEnviado] = useState<boolean>(false);
  const [errores, setErrores] = useState<Record<string, string>>({});

  // Cargar medicamentos al montar
  useEffect(() => {
    const cargarMedicamentos = async () => {
      try {
        const perfilJson = localStorage.getItem('usuario_perfil');
        if (!perfilJson) return;
        
        const perfil = JSON.parse(perfilJson);
        const meds = await obtenerMedicamentos(perfil.id);
        setMedicamentos(meds);
      } catch (error) {
        console.error('Error al cargar medicamentos:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarMedicamentos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validar = () => {
    const newErrors: { [k: string]: string } = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre del medicamento es obligatorio';
    if (!formData.dosis.trim()) newErrors.dosis = 'La dosis es obligatoria';
    if (!formData.duracion.trim()) newErrors.duracion = 'La duración es obligatoria';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validar();
    setErrores(v);
    if (Object.keys(v).length > 0) return;

    try {
      const perfilJson = localStorage.getItem('usuario_perfil');
      if (!perfilJson) throw new Error('Usuario no encontrado');
      
      const perfil = JSON.parse(perfilJson);
      
      const nuevoMedicamento = await crearMedicamento({
        usuario_id: perfil.id,
        nombre: formData.nombre,
        dosis: formData.dosis,
        frecuencia: formData.frecuencia,
        horarios: formData.horarios,
        duracion: parseInt(formData.duracion),
        unidad_duracion: formData.unidad as 'días' | 'semanas' | 'meses',
        indicaciones: formData.indicaciones,
      });

      if (nuevoMedicamento) {
        setMedicamentos([nuevoMedicamento, ...medicamentos]);
        setEnviado(true);
        setTimeout(() => setEnviado(false), 3000);
        setFormData({ nombre: '', dosis: '', frecuencia: 'Diario', horarios: '', duracion: '', unidad: 'días', indicaciones: '' });
      }
    } catch (error: any) {
      setErrores({ submit: error.message });
    }
  };

  const handleEliminarMedicamento = async (medicamentoId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este medicamento?')) {
      await desactivarMedicamento(medicamentoId);
      setMedicamentos(medicamentos.filter(m => m.id !== medicamentoId));
    }
  };

  return (
    <div className="registro-container">
      <h2 className="registro-title">Registro de Medicamentos</h2>
      <div className="registro-card">
        {enviado && <div className="success-message">✅ Medicamento registrado correctamente</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre del medicamento*</label>
            <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: Paracetamol" />
            {errores.nombre && <p className="error-message">{errores.nombre}</p>}
          </div>

          <div className="form-group">
            <label>Dosis*</label>
            <input name="dosis" value={formData.dosis} onChange={handleChange} placeholder="Ej: 500 mg" />
            {errores.dosis && <p className="error-message">{errores.dosis}</p>}
          </div>

          <div className="form-group">
            <label>Frecuencia</label>
            <select name="frecuencia" value={formData.frecuencia} onChange={handleChange}>
              <option>Diario</option>
              <option>Cada 8 horas</option>
              <option>Cada 12 horas</option>
              <option>Según indicación</option>
            </select>
          </div>

          <div className="form-group">
            <label>Horarios (opcional)</label>
            <input name="horarios" value={formData.horarios} onChange={handleChange} placeholder="08:00, 14:00, 20:00" />
          </div>

          <div className="form-group">
            <label>Duración*</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input name="duracion" value={formData.duracion} onChange={handleChange} placeholder="Ej: 7" />
              <select name="unidad" value={formData.unidad} onChange={handleChange}>
                <option>días</option>
                <option>semanas</option>
                <option>meses</option>
              </select>
            </div>
            {errores.duracion && <p className="error-message">{errores.duracion}</p>}
          </div>

          <div className="form-group">
            <label>Indicaciones del médico (opcional)</label>
            <textarea name="indicaciones" value={formData.indicaciones} onChange={handleChange} rows={4} />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-primary" type="submit">Guardar</button>
            <button className="btn-secondary" type="button" onClick={() => setFormData({ nombre: '', dosis: '', frecuencia: 'Diario', horarios: '', duracion: '', unidad: 'días', indicaciones: '' })}>Limpiar</button>
          </div>
        </form>
      </div>

      <h3 style={{marginTop: '2rem', marginBottom: '1rem'}}>Medicamentos registrados</h3>
      {cargando && <p>Cargando medicamentos...</p>}
      {medicamentos.length === 0 && !cargando && <p>No hay medicamentos registrados</p>}
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Medicamento</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Dosis</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Frecuencia</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Duración</th>
              <th style={{ padding: '0.75rem', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {medicamentos.map((med) => (
              <tr key={med.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '0.75rem' }}>{med.nombre}</td>
                <td style={{ padding: '0.75rem' }}>{med.dosis}</td>
                <td style={{ padding: '0.75rem' }}>{med.frecuencia}</td>
                <td style={{ padding: '0.75rem' }}>{med.duracion} {med.unidad_duracion}</td>
                <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                  <button 
                    onClick={() => handleEliminarMedicamento(med.id)}
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegistroMedicamentos;
