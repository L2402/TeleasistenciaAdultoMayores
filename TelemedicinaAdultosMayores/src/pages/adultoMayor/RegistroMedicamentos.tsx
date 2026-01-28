import React, { useState, useEffect } from 'react';
import '../../styles/medicamentos.css';
import { obtenerMedicamentos, Medicamento } from '../../services/medicamentos';

const RegistroMedicamentos: React.FC = () => {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar medicamentos al montar
  useEffect(() => {
    const cargarMedicamentos = async () => {
      try {
        setCargando(true);
        setError(null);
        
        const perfilJson = localStorage.getItem('usuario_perfil');
        if (!perfilJson) {
          setError('No se encontró el usuario');
          return;
        }
        
        const perfil = JSON.parse(perfilJson);
        const meds = await obtenerMedicamentos(perfil.id);
        setMedicamentos(meds);
      } catch (error) {
        console.error('Error al cargar medicamentos:', error);
        setError('Error al cargar medicamentos');
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
    <div className="med-page">
      <header className="med-hero">
        <div className="med-inner container">
          <h1>Mis Medicamentos</h1>
          <p className="med-sub">Medicamentos prescritos por tu médico</p>
        </div>
      </header>

      <main className="med-content container">
        {cargando ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Cargando medicamentos...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#b91c1c' }}>
            <p>{error}</p>
          </div>
        ) : medicamentos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            <p>No tienes medicamentos prescritos aún</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {medicamentos.map((med) => (
              <div key={med.id} className="med-item-card card" style={{ 
                padding: '1.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#111827' }}>{med.nombre}</h3>
                    {med.medico && (
                      <p style={{ margin: '0.25rem 0', color: '#6b7280', fontSize: '0.875rem' }}>
                        Prescrito por: Dr(a). {med.medico.nombre} {med.medico.apellido}
                      </p>
                    )}
                    {med.fecha_inicio && (
                      <p style={{ margin: '0.25rem 0', color: '#6b7280', fontSize: '0.875rem' }}>
                        Desde: {new Date(med.fecha_inicio).toLocaleDateString('es-ES')}
                      </p>
                    )}
                  </div>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    backgroundColor: '#10b981', 
                    color: 'white', 
                    borderRadius: '9999px',
                    fontSize: '0.875rem'
                  }}>
                    Activo
                  </span>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                  <div>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>Dosis</p>
                    <p style={{ margin: '0.25rem 0', fontWeight: 500 }}>{med.dosis}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>Frecuencia</p>
                    <p style={{ margin: '0.25rem 0', fontWeight: 500 }}>{med.frecuencia}</p>
                  </div>
                  {med.horarios && (
                    <div>
                      <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>Horarios</p>
                      <p style={{ margin: '0.25rem 0', fontWeight: 500 }}>{med.horarios}</p>
                    </div>
                  )}
                  <div>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>Duración</p>
                    <p style={{ margin: '0.25rem 0', fontWeight: 500 }}>{med.duracion} {med.unidad_duracion}</p>
                  </div>
                </div>
                
                {med.indicaciones && (
                  <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Indicaciones</p>
                    <p style={{ margin: 0 }}>{med.indicaciones}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default RegistroMedicamentos;
