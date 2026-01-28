import React, { useState, useEffect } from 'react';
import '../../styles/medicamentos.css';
import { obtenerPacientesDelMedico } from '../../services/medicoPaciente';
import { crearMedicamento } from '../../services/medicamentos';

type FormData = {
  paciente_id: string;
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
    paciente_id: '',
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
  const [pacientes, setPacientes] = useState<any[]>([]);

  useEffect(() => {
    const cargarPacientes = async () => {
      const perfilJson = localStorage.getItem('usuario_perfil');
      if (!perfilJson) return;
      
      const perfil = JSON.parse(perfilJson);
      const pacientesData = await obtenerPacientesDelMedico(perfil.id);
      setPacientes(pacientesData);
    };
    
    cargarPacientes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({ ...prev, [name]: value }));
  };

  const validar = () => {
    const newErrors: { [k: string]: string } = {};
    if (!formData.paciente_id) newErrors.paciente_id = 'Debes seleccionar un paciente';
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
      if (!perfilJson) {
        alert('Error: No se encontró el usuario');
        return;
      }
      
      const perfil = JSON.parse(perfilJson);

      console.log('Form Data:', formData);
      console.log('Paciente seleccionado ID:', formData.paciente_id);
      console.log('Lista de pacientes:', pacientes);

      const nuevoMedicamento = {
        usuario_id: formData.paciente_id,
        medico_id: perfil.id,
        nombre: formData.nombre,
        dosis: formData.dosis,
        frecuencia: formData.frecuencia,
        horarios: formData.horarios,
        duracion: parseInt(formData.duracion),
        unidad_duracion: formData.unidad as 'días' | 'semanas' | 'meses',
        indicaciones: formData.indicaciones,
        prescrito_por: `${perfil.nombre} ${perfil.apellido}`,
        fecha_inicio: new Date().toISOString().split('T')[0]
      };

      console.log('Medicamento a enviar:', nuevoMedicamento);

      const resultado = await crearMedicamento(nuevoMedicamento);
      
      if (resultado) {
        setEnviado(true);
        setTimeout(() => setEnviado(false), 3000);
        setFormData({ 
          paciente_id: '',
          nombre: '', 
          dosis: '', 
          frecuencia: 'Diario', 
          horarios: '', 
          duracion: '', 
          unidad: 'días', 
          indicaciones: '' 
        });
      } else {
        alert('Error al guardar el medicamento');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el medicamento');
    }
  };

  return (
    <div className="med-page">
      <header className="med-hero">
        <div className="med-inner container">
          <h1>Registro de Medicamentos</h1>
          <p className="med-sub">Gestione la medicación de sus pacientes de forma segura y sencilla</p>
        </div>
      </header>

      <main className="med-content container">
        <section className="med-form-card card fade-in">
          {enviado && <div className="med-success toast toast-success">Medicamento registrado correctamente</div>}

          <form onSubmit={handleSubmit} className="med-form">
            <div className="row">
              <div className="col">
                <label>Paciente*</label>
                <select 
                  name="paciente_id" 
                  value={formData.paciente_id} 
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  <option value="">Selecciona un paciente</option>
                  {pacientes.map((paciente) => (
                    <option key={paciente.id} value={paciente.id}>
                      {paciente.nombre} {paciente.apellido}
                    </option>
                  ))}
                </select>
                {errores.paciente_id && <p className="error-message">{errores.paciente_id}</p>}
              </div>
            </div>

            <div className="row">
              <div className="col">
                <label>Nombre del medicamento*</label>
                <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: Paracetamol" />
                {errores.nombre && <p className="error-message">{errores.nombre}</p>}
              </div>

              <div className="col">
                <label>Dosis*</label>
                <input name="dosis" value={formData.dosis} onChange={handleChange} placeholder="Ej: 500 mg" />
                {errores.dosis && <p className="error-message">{errores.dosis}</p>}
              </div>
            </div>

            <div className="row">
              <div className="col">
                <label>Frecuencia</label>
                <select name="frecuencia" value={formData.frecuencia} onChange={handleChange}>
                  <option>Diario</option>
                  <option>Cada 8 horas</option>
                  <option>Cada 12 horas</option>
                  <option>Según indicación</option>
                </select>
              </div>

              <div className="col">
                <label>Horarios (opcional)</label>
                <input name="horarios" value={formData.horarios} onChange={handleChange} placeholder="08:00, 14:00, 20:00" />
              </div>
            </div>

            <div className="row">
              <div className="col small">
                <label>Duración*</label>
                <input name="duracion" value={formData.duracion} onChange={handleChange} placeholder="Ej: 7" />
                {errores.duracion && <p className="error-message">{errores.duracion}</p>}
              </div>

              <div className="col small">
                <label>&nbsp;</label>
                <select name="unidad" value={formData.unidad} onChange={handleChange}>
                  <option>días</option>
                  <option>semanas</option>
                  <option>meses</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col full">
                <label>Indicaciones del médico (opcional)</label>
                <textarea name="indicaciones" value={formData.indicaciones} onChange={handleChange} rows={3} />
              </div>
            </div>

            <div className="med-actions">
              <button className="btn btn-primary" type="submit">Guardar</button>
              <button className="btn btn-ghost" type="button" onClick={() => setFormData({ 
                paciente_id: '',
                nombre: '', 
                dosis: '', 
                frecuencia: 'Diario', 
                horarios: '', 
                duracion: '', 
                unidad: 'días', 
                indicaciones: '' 
              })}>Limpiar</button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default RegistroMedicamentos;