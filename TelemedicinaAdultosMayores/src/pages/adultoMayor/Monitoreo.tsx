import { useState, useEffect } from "react";
import "../../styles/monitoreo.css";
import { crearMonitoreo, obtenerMonitoreos, Monitoreo as MonitoreoType } from "../../services/monitoreo";

interface Medicion {
  id: number;
  tipo: "presion" | "glucosa" | "peso" | "temperatura" | "oxigeno";
  valor: string;
  fecha: string;
  hora: string;
  nota?: string;
}

const Monitoreo = () => {
  const [mediciones, setMediciones] = useState<Medicion[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const perfilJson = localStorage.getItem('usuario_perfil');
        if (!perfilJson) return;
        
        const perfil = JSON.parse(perfilJson);
        const data = await obtenerMonitoreos(perfil.id);
        
        // Convertir datos de BD a formato del componente
        const medicionesConvertidas: Medicion[] = data.map((m: MonitoreoType) => {
          const fecha = new Date(m.fecha_medicion);
          let tipo: Medicion["tipo"] = "presion";
          let valor = "";
          
          if (m.presion_arterial) {
            tipo = "presion";
            valor = m.presion_arterial;
          } else if (m.glucosa) {
            tipo = "glucosa";
            valor = `${m.glucosa} mg/dL`;
          } else if (m.peso) {
            tipo = "peso";
            valor = `${m.peso} kg`;
          } else if (m.saturacion_oxigeno) {
            tipo = "oxigeno";
            valor = `${m.saturacion_oxigeno}%`;
          } else if (m.temperatura) {
            tipo = "temperatura";
            valor = `${m.temperatura}°C`;
          }
          
          return {
            id: parseInt(m.id.replace(/-/g, '').substring(0, 10), 16),
            tipo,
            valor,
            fecha: fecha.toISOString().split('T')[0],
            hora: fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            nota: m.notas
          };
        });
        
        setMediciones(medicionesConvertidas);
      } catch (err) {
        console.error('Error al cargar monitoreos:', err);
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, []);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<string>("todas");
  
  const [nuevaMedicion, setNuevaMedicion] = useState({
    tipo: "presion" as Medicion["tipo"],
    valor: "",
    nota: ""
  });

  const tiposMedicion = [
    { id: "presion", nombre: "Presión Arterial", icon: "💓", unidad: "mmHg", color: "#e74c3c" },
    { id: "glucosa", nombre: "Glucosa", icon: "🩸", unidad: "mg/dL", color: "#3498db" },
    { id: "peso", nombre: "Peso", icon: "⚖️", unidad: "kg", color: "#9b59b6" },
    { id: "temperatura", nombre: "Temperatura", icon: "🌡️", unidad: "°C", color: "#e67e22" },
    { id: "oxigeno", nombre: "Oxígeno", icon: "🫁", unidad: "%", color: "#1abc9c" }
  ];

  const getTipoInfo = (tipo: string) => {
    return tiposMedicion.find(t => t.id === tipo) || tiposMedicion[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nuevaMedicion.valor) {
      alert("Por favor ingresa un valor");
      return;
    }

    try {
      const perfilJson = localStorage.getItem('usuario_perfil');
      if (!perfilJson) {
        alert('Usuario no encontrado');
        return;
      }
      
      const perfil = JSON.parse(perfilJson);
      const ahora = new Date().toISOString();
      
      // Preparar datos según el tipo de medición
      const datosMonitoreo: any = {
        usuario_id: perfil.id,
        fecha_medicion: ahora,
        notas: nuevaMedicion.nota
      };
      
      switch (nuevaMedicion.tipo) {
        case 'presion':
          datosMonitoreo.presion_arterial = nuevaMedicion.valor;
          break;
        case 'glucosa':
          datosMonitoreo.glucosa = parseInt(nuevaMedicion.valor);
          break;
        case 'peso':
          datosMonitoreo.peso = parseFloat(nuevaMedicion.valor);
          break;
        case 'temperatura':
          datosMonitoreo.temperatura = parseFloat(nuevaMedicion.valor);
          break;
        case 'oxigeno':
          datosMonitoreo.saturacion_oxigeno = parseFloat(nuevaMedicion.valor);
          break;
      }
      
      const nueva = await crearMonitoreo(datosMonitoreo);
      
      if (nueva) {
        const fecha = new Date(nueva.fecha_medicion);
        const nuevaM: Medicion = {
          id: Date.now(),
          tipo: nuevaMedicion.tipo,
          valor: nuevaMedicion.valor,
          fecha: fecha.toISOString().split('T')[0],
          hora: fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          nota: nuevaMedicion.nota
        };

        setMediciones([nuevaM, ...mediciones]);
        setNuevaMedicion({ tipo: "presion", valor: "", nota: "" });
        setMostrarFormulario(false);
      }
    } catch (err: any) {
      alert(err.message || 'Error al guardar medición');
    }
  };

  const medicionesFiltradas = mediciones.filter(m => {
    if (filtroTipo === "todas") return true;
    return m.tipo === filtroTipo;
  });

  const getEstadoSalud = (tipo: string, valor: string) => {
    // Lógica simplificada para determinar si está en rango normal
    switch (tipo) {
      case "presion":
        const [sistolica] = valor.split('/').map(Number);
        return sistolica >= 90 && sistolica <= 120 ? "normal" : "alerta";
      case "glucosa":
        const glucosa = parseInt(valor);
        return glucosa >= 70 && glucosa <= 100 ? "normal" : "alerta";
      case "oxigeno":
        const oxigeno = parseInt(valor);
        return oxigeno >= 95 ? "normal" : "alerta";
      default:
        return "normal";
    }
  };

  return (
    <div className="monitoreo-container">
      <div className="monitoreo-header">
        <div>
          <h2>Monitoreo de Salud</h2>
        </div>
        <button 
          className="btn-nueva-medicion"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? "✕ Cerrar" : "+ Nueva Medición"}
        </button>
      </div>

      {/* Formulario para nueva medición */}
      {mostrarFormulario && (
        <div className="formulario-medicion">
          <h3>Registrar Nueva Medición</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tipo de Medición:</label>
              <select 
                value={nuevaMedicion.tipo}
                onChange={(e) => setNuevaMedicion({...nuevaMedicion, tipo: e.target.value as Medicion["tipo"]})}
              >
                {tiposMedicion.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.icon} {tipo.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Valor ({getTipoInfo(nuevaMedicion.tipo).unidad}):</label>
              <input 
                type="text"
                value={nuevaMedicion.valor}
                onChange={(e) => setNuevaMedicion({...nuevaMedicion, valor: e.target.value})}
                placeholder={`Ej: ${nuevaMedicion.tipo === "presion" ? "120/80" : "95"}`}
              />
            </div>

            <div className="form-group">
              <label>Nota (opcional):</label>
              <input 
                type="text"
                value={nuevaMedicion.nota}
                onChange={(e) => setNuevaMedicion({...nuevaMedicion, nota: e.target.value})}
                placeholder="Ej: Después del desayuno"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-guardar">Guardar Medición</button>
              <button 
                type="button" 
                className="btn-cancelar-form"
                onClick={() => setMostrarFormulario(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tarjetas de resumen */}
      <div className="resumen-cards">
        {tiposMedicion.map(tipo => {
          const ultimaMedicion = mediciones.find(m => m.tipo === tipo.id);
          return (
            <div key={tipo.id} className="resumen-card" style={{ borderLeftColor: tipo.color }}>
              <div className="card-icon" style={{ background: tipo.color + '20', color: tipo.color }}>
                {tipo.icon}
              </div>
              <div className="card-info">
                <p className="card-label">{tipo.nombre}</p>
                <p className="card-value">
                  {ultimaMedicion ? ultimaMedicion.valor : "Sin datos"}
                </p>
                {ultimaMedicion && (
                  <p className="card-fecha">{ultimaMedicion.fecha}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Filtros */}
      <div className="filtros-monitoreo">
        <button 
          className={filtroTipo === "todas" ? "filtro-btn active" : "filtro-btn"}
          onClick={() => setFiltroTipo("todas")}
        >
          Todas
        </button>
        {tiposMedicion.map(tipo => (
          <button 
            key={tipo.id}
            className={filtroTipo === tipo.id ? "filtro-btn active" : "filtro-btn"}
            onClick={() => setFiltroTipo(tipo.id)}
          >
            {tipo.icon} {tipo.nombre}
          </button>
        ))}
      </div>

      {/* Historial de mediciones */}
      <div className="historial-mediciones">
        <h3>Historial de Mediciones</h3>
        {medicionesFiltradas.length === 0 ? (
          <div className="no-mediciones">
            <p>No hay mediciones registradas</p>
          </div>
        ) : (
          <div className="mediciones-lista">
            {medicionesFiltradas.map(medicion => {
              const tipoInfo = getTipoInfo(medicion.tipo);
              const estado = getEstadoSalud(medicion.tipo, medicion.valor);
              
              return (
                <div key={medicion.id} className="medicion-item">
                  <div className="medicion-icon" style={{ background: tipoInfo.color + '20' }}>
                    <span style={{ color: tipoInfo.color }}>{tipoInfo.icon}</span>
                  </div>
                  
                  <div className="medicion-detalles">
                    <div className="medicion-header-item">
                      <h4>{tipoInfo.nombre}</h4>
                      <span className={`estado-badge ${estado}`}>
                        {estado === "normal" ? "✓ Normal" : "⚠ Revisar"}
                      </span>
                    </div>
                    
                    <p className="medicion-valor">{medicion.valor}</p>
                    
                    <div className="medicion-meta">
                      <span>📅 {new Date(medicion.fecha).toLocaleDateString('es-ES')}</span>
                      <span>🕐 {medicion.hora}</span>
                    </div>
                    
                    {medicion.nota && (
                      <p className="medicion-nota">📝 {medicion.nota}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Monitoreo;