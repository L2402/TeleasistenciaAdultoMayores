# Guía de Integración de Base de Datos

## Servicios Creados

### 1. `src/services/citas.ts`
Maneja todas las operaciones con citas:
- `obtenerCitasUsuario(usuarioId)` - Obtiene citas del usuario actual
- `obtenerCitasMedico(medicoId)` - Obtiene citas del médico
- `crearCita(cita)` - Crea una nueva cita
- `actualizarCita(citaId, actualizaciones)` - Actualiza una cita
- `cancelarCita(citaId)` - Cancela una cita

### 2. `src/services/medicamentos.ts`
Maneja medicamentos del usuario:
- `obtenerMedicamentos(usuarioId)` - Lista medicamentos activos
- `crearMedicamento(medicamento)` - Agrega un nuevo medicamento
- `actualizarMedicamento(medicamentoId, actualizaciones)` - Modifica medicamento
- `desactivarMedicamento(medicamentoId)` - Desactiva un medicamento

### 3. `src/services/registroAnimo.ts`
Maneja registros de estado anímico:
- `obtenerRegistrosAnimo(usuarioId)` - Lista todos los registros
- `crearRegistroAnimo(registro)` - Crea un nuevo registro
- `obtenerRegistrosAnimoUltimosDias(usuarioId, dias)` - Últimos N días
- `obtenerEstadisticasAnimo(usuarioId)` - Estadísticas de estado anímico

## Componentes Actualizados

### 1. `src/pages/adultoMayor/Citas.tsx`
✅ Ahora carga citas reales desde Supabase
✅ Muestra datos del médico asignado
✅ Permite confirmar/cancelar citas
✅ Filtra por estado

### 2. `src/pages/adultoMayor/RegistroMedicamentos.tsx`
✅ Guarda medicamentos en la BD
✅ Muestra tabla de medicamentos registrados
✅ Permite eliminar medicamentos
✅ Validación en el formulario

### 3. `src/pages/adultoMayor/RegistroAnimo.tsx`
✅ Guarda registros de animo en Supabase
✅ Muestra historial de registros
✅ Carga automática de datos
✅ Formato de fecha en español

## Cómo Usar

### En cualquier componente donde necesites datos:

```typescript
import { obtenerCitasUsuario } from '../services/citas';

// Dentro del useEffect
const cargarCitas = async () => {
  const perfil = JSON.parse(localStorage.getItem('usuario_perfil') || '{}');
  const citas = await obtenerCitasUsuario(perfil.id);
  setCitas(citas);
};
```

### Para crear datos:

```typescript
import { crearCita } from '../services/citas';

const nuevaCita = await crearCita({
  usuario_id: userId,
  medico_id: medicoId,
  fecha: '2026-02-15',
  hora: '10:00',
  especialidad: 'Cardiología',
  motivo: 'Control de presión',
  estado: 'pendiente'
});
```

## Nota Importante

**Las contraseñas se manejan automáticamente en Supabase.** No necesitas hacer nada especial - cuando usas `auth.signUp()`, Supabase hashea y guarda la contraseña de forma segura.

## Próximos Pasos

Puedes agregar más servicios para:
- Monitoreo de signos vitales
- Mensajes entre usuarios
- Incidencias
- Reportes médicos
- Relaciones medico-paciente y cuidador-adulto

Todos siguen el mismo patrón de los servicios que ya creamos.
