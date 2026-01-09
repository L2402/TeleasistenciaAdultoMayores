import React, { useState, useEffect } from 'react';
import '../../styles/medicamentos.css';

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
  const [lista, setLista] = useState<Array<FormData & { id: number; justAdded?: boolean }>>([]);
  const [nuevoId, setNuevoId] = useState<number | null>(null);

  useEffect(() => {
    if (nuevoId !== null) {
      const t = setTimeout(() => setLista((prev: Array<FormData & { id: number; justAdded?: boolean }>) => prev.map((i) => i.id === nuevoId ? ({ ...i, justAdded: false }) : i)), 480);
      const t2 = setTimeout(() => setNuevoId(null), 520);
      return () => { clearTimeout(t); clearTimeout(t2); }
    }
  }, [nuevoId]);

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

    // Agregar a la lista (simular persistencia)
    const nuevo = { id: Date.now(), ...formData, justAdded: true };
    setLista((prev: Array<FormData & { id: number; justAdded?: boolean }>) => [nuevo, ...prev]);
    setNuevoId(nuevo.id);

    console.log('Medicamento registrado:', formData);
    setEnviado(true);

    setTimeout(() => setEnviado(false), 3000);
    setFormData({ nombre: '', dosis: '', frecuencia: 'Diario', horarios: '', duracion: '', unidad: 'días', indicaciones: '' });
  };

  const handleEliminar = (id: number) => {
    setLista((prev: Array<FormData & { id: number; justAdded?: boolean }>) => prev.filter((i) => i.id !== id));
  }

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
              <button className="btn btn-ghost" type="button" onClick={() => setFormData({ nombre: '', dosis: '', frecuencia: 'Diario', horarios: '', duracion: '', unidad: 'días', indicaciones: '' })}>Limpiar</button>
            </div>
          </form>
        </section>

        <aside className="med-list-card card fade-in-slow">
          <h3>Medicamentos registrados ({lista.length})</h3>
          {lista.length === 0 ? (
            <p className="muted">No hay medicamentos registrados todavía.</p>
          ) : (
            <ul className="med-list">
              {lista.map((item: FormData & { id: number; justAdded?: boolean }) => (
                <li key={item.id} className={item.justAdded ? 'new' : ''}>
                  <div>
                    <strong>{item.nombre}</strong>
                    <div className="muted small">{item.dosis} • {item.frecuencia} • {item.duracion} {item.unidad}</div>
                  </div>
                  <div>
                    <button className="btn-sm btn-danger" onClick={() => handleEliminar(item.id)}>Eliminar</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </main>
    </div>
  );
};

export default RegistroMedicamentos;