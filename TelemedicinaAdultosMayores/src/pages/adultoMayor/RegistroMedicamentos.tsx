import React, { useState } from 'react';
import '../../styles/registroUsuario.css';

type FormData = {
  nombre: string;
  dosis: string;
  frecuencia: string;
  horarios: string;
  duracion: string;
  unidad: string;
  indicaciones: string;
};

const RegistroMedicamentos: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    dosis: '',
    frecuencia: 'Diario',
    horarios: '',
    duracion: '',
    unidad: 'días',
    indicaciones: ''
  });

  const [enviado, setEnviado] = useState<boolean>(false);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({ ...prev, [name]: value }));
  };

  const validar = () => {
    const newErrors: { [k: string]: string } = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre del medicamento es obligatorio';
    if (!formData.dosis.trim()) newErrors.dosis = 'La dosis es obligatoria';
    if (!formData.duracion.trim()) newErrors.duracion = 'La duración es obligatoria';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validar();
    setErrores(v);
    if (Object.keys(v).length > 0) return;

    // TODO: persistir en la base de datos (Supabase)
    console.log('Medicamento registrado:', formData);
    setEnviado(true);

    setTimeout(() => setEnviado(false), 3000);
    setFormData({ nombre: '', dosis: '', frecuencia: 'Diario', horarios: '', duracion: '', unidad: 'días', indicaciones: '' });
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
    </div>
  );
};

export default RegistroMedicamentos;
