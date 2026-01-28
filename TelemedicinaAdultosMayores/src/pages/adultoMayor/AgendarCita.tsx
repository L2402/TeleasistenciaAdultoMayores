import { useState, useEffect } from 'react';
import '../../styles/citas.css';
import { crearCita } from '../../services/citas';
import { obtenerMedicosDelPaciente, MedicoPaciente } from '../../services/medicoPaciente';

interface AgendarCitaProps {
  onCitaCreada?: () => void;
  onCerrar?: () => void;
}

const AgendarCita: React.FC<AgendarCitaProps> = ({ onCitaCreada, onCerrar }) => {
  const [medicos, setMedicos] = useState<MedicoPaciente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    medico_id: '',
    fecha: '',
    hora: '',
    especialidad: '',
    motivo: ''
  });

  useEffect(() => {
    const cargarMedicos = async () => {
      try {
        const perfilJson = localStorage.getItem('usuario_perfil');
        if (!perfilJson) {
          setError('Usuario no encontrado');
          return;
        }
        
        const perfil = JSON.parse(perfilJson);
        const medicosData = await obtenerMedicosDelPaciente(perfil.id);
        
        if (medicosData.length === 0) {
          setError('No tienes médicos asignados. Contacta al administrador.');
        }
        
        setMedicos(medicosData);
      } catch (err: any) {
        setError('Error al cargar médicos');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarMedicos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Si selecciona un médico, auto-completar especialidad
    if (name === 'medico_id') {
      const medico = medicos.find(m => m.medico_id === value);
      if (medico?.especialidad) {
        setFormData(prev => ({ ...prev, especialidad: medico.especialidad || '' }));
      }
    }
  };

  const validar = () => {
    if (!formData.medico_id) return 'Selecciona un médico';
    if (!formData.fecha) return 'Selecciona una fecha';
    if (!formData.hora) return 'Selecciona una hora';
    if (!formData.especialidad) return 'Ingresa la especialidad';
    if (!formData.motivo) return 'Describe el motivo de la cita';
    
    // Validar que la fecha no sea en el pasado
    const fechaSeleccionada = new Date(`${formData.fecha}T${formData.hora}`);
    if (fechaSeleccionada < new Date()) {
      return 'No puedes agendar citas en el pasado';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errorValidacion = validar();
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    setEnviando(true);
    setError(null);

    try {
      const perfilJson = localStorage.getItem('usuario_perfil');
      if (!perfilJson) throw new Error('Usuario no encontrado');
      
      const perfil = JSON.parse(perfilJson);
      
      const nuevaCita = await crearCita({
        usuario_id: perfil.id,
        medico_id: formData.medico_id,
        fecha: formData.fecha,
        hora: formData.hora,
        especialidad: formData.especialidad,
        motivo: formData.motivo,
        estado: 'pendiente'
      });

      if (nuevaCita) {
        alert('✅ Cita agendada exitosamente');
        if (onCitaCreada) onCitaCreada();
        if (onCerrar) onCerrar();
      } else {
        setError('No se pudo crear la cita');
      }
    } catch (err: any) {
      setError(err.message || 'Error al agendar cita');
    } finally {
      setEnviando(false);
    }
  };

  // Obtener fecha mínima (hoy)
  const fechaMinima = new Date().toISOString().split('T')[0];

  return (
    <div className="agendar-cita-container">
      <div className="agendar-cita-card">
        <div className="agendar-header">
          <h2>Agendar Nueva Cita</h2>
          {onCerrar && (
            <button className="btn-cerrar" onClick={onCerrar}>✕</button>
          )}
        </div>

        {cargando && <p>Cargando médicos...</p>}
        {error && <div className="mensaje-error">{error}</div>}

        {!cargando && medicos.length > 0 && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Médico*</label>
              <select 
                name="medico_id" 
                value={formData.medico_id} 
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un médico</option>
                {medicos.map((mp) => (
                  <option key={mp.medico_id} value={mp.medico_id}>
                    Dr(a). {mp.medico?.nombre} {mp.medico?.apellido}
                    {mp.especialidad && ` - ${mp.especialidad}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Especialidad*</label>
              <input
                type="text"
                name="especialidad"
                value={formData.especialidad}
                onChange={handleChange}
                placeholder="Ej: Cardiología"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Fecha*</label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  min={fechaMinima}
                  required
                />
              </div>

              <div className="form-group">
                <label>Hora*</label>
                <input
                  type="time"
                  name="hora"
                  value={formData.hora}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Motivo de la consulta*</label>
              <textarea
                name="motivo"
                value={formData.motivo}
                onChange={handleChange}
                rows={4}
                placeholder="Describe brevemente el motivo de tu consulta"
                required
              />
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-primary"
                disabled={enviando}
              >
                {enviando ? 'Agendando...' : 'Agendar Cita'}
              </button>
              {onCerrar && (
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={onCerrar}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AgendarCita;
