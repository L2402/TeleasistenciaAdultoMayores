# 🚀 Guía de Activación - Interfaz Cuidador

Este archivo te guía paso a paso para activar la nueva funcionalidad del cuidador en tu aplicación.

## Paso 1: Crear las Funciones SQL en Supabase ⚡

### ✅ Debes hacer esto UNA sola vez

1. Abre Supabase en tu navegador: https://supabase.com
2. Selecciona tu proyecto: **pcbqllsmphpturmmkxii**
3. Ve al menú izquierdo y haz clic en **SQL Editor**
4. Haz clic en **+ New Query**

5. **Copia y pega AMBAS funciones** (ver el archivo `INSTRUCCIONES_SQL_CUIDADOR.md`)

6. Haz clic en **Run** (botón rojo abajo a la derecha)

### Validación:
- Deberías ver ✅ "Success" para ambas funciones
- Si ves error, verifica que copiaste el SQL completo y sin caracteres especiales

---

## Paso 2: Verificar que todo está actualizado ✔️

Los siguientes archivos ya han sido actualizados:

- ✅ `src/App.tsx` - Rutas del cuidador
- ✅ `src/components/sidebar.tsx` - Menú del cuidador
- ✅ `src/pages/cuidador/BuscarAdultos.tsx` - Componente nuevo
- ✅ `src/pages/cuidador/CitasCuidador.tsx` - Componente nuevo
- ✅ `src/pages/cuidador/MedicamentosCuidador.tsx` - Componente nuevo
- ✅ `src/services/adultosCuidador.ts` - Servicio nuevo
- ✅ `src/pages/cuidador/InicioCuidador.tsx` - Actualizado

---

## Paso 3: Probar la Aplicación 🧪

### En tu terminal (donde está abierto `npm run dev`):

1. Presiona **F5** para recargar la aplicación (o Ctrl+R)
2. Si hay errores de compilación, lee la consola

### Crear datos de prueba:

#### Opción A: Crear un nuevo cuidador
1. Haz clic en "Registro" en la página de login
2. Completa el formulario:
   - Nombre: `Juan`
   - Apellido: `García`
   - Correo: `cuidador@test.com`
   - Contraseña: `Test1234!`
   - Tipo usuario: **Cuidador** ← IMPORTANTE
3. Haz clic en "Registrarse"

#### Opción B: Crear un adulto mayor (si no tienes)
1. Haz clic en "Registro"
2. Completa:
   - Nombre: `Carlos`
   - Apellido: `Pérez`
   - Correo: `adulto@test.com`
   - Contraseña: `Test1234!`
   - Tipo usuario: **Adulto Mayor** ← IMPORTANTE
3. Registra

### Asignar adultos al cuidador:

1. Inicia sesión con el cuidador: `cuidador@test.com` / `Test1234!`
2. En el sidebar, haz clic en **"Adultos a cargo"**
3. En el campo de búsqueda, escribe: `Carlos` (o parte del nombre)
4. Haz clic en el botón **"Buscar"**
5. Haz clic en **"Agregar"** junto al adulto encontrado
6. Deberías ver la alerta: ✅ **"Adulto agregado exitosamente"**

---

## Paso 4: Usar las Nuevas Interfaces 📱

### 1️⃣ Adultos a Cargo (BuscarAdultos)
**URL:** `http://localhost:5173/adultos`

- 🔍 Busca adultos por nombre
- ➕ Agrega a tu lista de cuidado
- ❌ Si ya está agregado, muestra error

### 2️⃣ Citas (CitasCuidador)
**URL:** `http://localhost:5173/citas`

- 📋 Dropdown para seleccionar adulto o "Ver todos"
- 🔗 Filtro por estado: Todas, Pendientes, Confirmadas, Canceladas
- 📅 Muestra fecha, hora, doctor, especialidad
- 👨‍⚕️ Información del doctor que atiende

**Nota:** Si no ves citas, asegúrate de:
1. Haber agregado adultos a tu lista
2. Que esos adultos tengan citas en el sistema

### 3️⃣ Medicamentos (MedicamentosCuidador)
**URL:** `http://localhost:5173/medicamentos`

- 📌 Dropdown para seleccionar adulto a cargo
- 💊 Lista todos los medicamentos del adulto
- 🟢 Filtro: Todos, Activos, Pausados
- 📋 Muestra:
  - Nombre y dosis
  - Frecuencia (cada 6 horas, 2 veces/día, etc.)
  - Doctor que lo prescribió
  - Indicaciones y efectos secundarios
  - Notas adicionales

---

## Paso 5: Crear Datos para Pruebas Completas 🧬

Para ver las interfaces en acción, necesitas:

### A. Crear un médico
```
Nombre: Dr. López
Correo: doctor@test.com
Contraseña: Test1234!
Tipo: Médico
```

### B. Crear una cita
1. Inicia sesión con el médico
2. Ve a "Pacientes" (Citas en sidebar)
3. Busca y agrega el adulto mayor "Carlos"
4. Ve a "Citas"
5. Crea una cita:
   - Selecciona el adulto: Carlos
   - Fecha: (mañana)
   - Hora: 10:00
   - Especialidad: Cardiología
   - Motivo: Control de presión

### C. Crear medicamentos
1. Aún como médico, ve a "Medicamentos"
2. Selecciona adulto: Carlos
3. Agrega medicamento:
   - Nombre: Losartán
   - Dosis: 50 mg
   - Unidad: mg
   - Frecuencia: cada_12_horas
   - Doctor: Dr. López
   - Indicaciones: Para la presión

### D. Ahora como cuidador:
1. Haz logout (Salir)
2. Inicia sesión con cuidador: `cuidador@test.com`
3. Ve a "Adultos a cargo" → Busca y agrega "Carlos"
4. Ve a "Citas" → Verás la cita creada
5. Ve a "Medicamentos" → Selecciona Carlos → Verás el medicamento

---

## Solución de Problemas 🔧

### ❌ "Función no existe"
**Solución:** Ejecuta nuevamente el SQL en Supabase (Paso 1)

### ❌ "No aparecen adultos en la búsqueda"
**Solución:** 
- Verifica que existan adultos mayores registrados con tipo_usuario = 'adultoMayor'
- La búsqueda es sensible al nombre exacto (o parte de él)

### ❌ "No veo citas ni medicamentos"
**Solución:**
- Primero agrega adultos con el botón "Adultos a cargo"
- Asegúrate de que esos adultos tengan citas/medicamentos creados

### ❌ "Error: usuario no encontrado"
**Solución:**
- Tu sesión expiró
- Haz logout (Salir) y login de nuevo
- Verifica que localStorage tenga `usuario_perfil`

### ❌ "Cambios no se ven"
**Solución:**
- Presiona **Ctrl+Shift+R** para recargar sin caché
- O cierra el navegador y abre de nuevo

---

## 📂 Archivos Clave

| Archivo | Función |
|---------|---------|
| `INSTRUCCIONES_SQL_CUIDADOR.md` | Todas las sentencias SQL a ejecutar |
| `RESUMEN_CUIDADOR.md` | Documentación técnica completa |
| `src/pages/cuidador/BuscarAdultos.tsx` | Interfaz buscar/agregar adultos |
| `src/pages/cuidador/CitasCuidador.tsx` | Interfaz ver citas de adultos a cargo |
| `src/pages/cuidador/MedicamentosCuidador.tsx` | Interfaz ver medicamentos con selector |
| `src/services/adultosCuidador.ts` | Funciones para base de datos |

---

## ✨ Características Implementadas

✅ Búsqueda de adultos mayores con filtrado
✅ Asignación de adultos al cuidador
✅ Vista de citas de adultos a cargo
✅ Filtro de citas por estado
✅ Vista de medicamentos con selector
✅ Filtro de medicamentos por estado
✅ Información completa del doctor/prescriptor
✅ Errores y validaciones manejadas
✅ Interfaz responsiva con estilos CSS existentes

---

## 🎯 Checklist Final

- [ ] Ejecuté las funciones SQL en Supabase
- [ ] Creé un usuario cuidador
- [ ] Creé un usuario adulto mayor
- [ ] Creé un usuario médico (opcional)
- [ ] Asigné adultos al cuidador
- [ ] Creé una cita para el adulto (como médico)
- [ ] Creé un medicamento para el adulto (como médico)
- [ ] Verifiqué citas como cuidador
- [ ] Verifiqué medicamentos como cuidador
- [ ] La aplicación funciona sin errores

---

## ❓ Preguntas Frecuentes

**P: ¿Qué pasa si intento agregar un adulto que ya está agregado?**
R: El sistema lo detecta y muestra: "Este adulto mayor ya está asignado a tu lista"

**P: ¿Puedo ver citas de todos mis adultos a la vez?**
R: Sí, en CitasCuidador hay un dropdown con opción "Ver citas de todos"

**P: ¿Dónde se guardan las asignaciones cuidador-adulto?**
R: En la tabla `adulto_cuidador` de tu BD Supabase

**P: ¿Qué es SECURITY DEFINER en las funciones SQL?**
R: Permite que las funciones bypass RLS para leer datos de otros usuarios (necesario para que el cuidador vea sus adultos)

**P: ¿Puedo modificar medicamentos como cuidador?**
R: Actualmente no. Los medicamentos son solo lectura para el cuidador. Son modificados por el médico.

---

## 📞 Soporte

Si algo no funciona:
1. Revisa la consola del navegador (F12 → Console)
2. Verifica que ejecutaste el SQL en Supabase
3. Confirma que tienes datos de prueba creados
4. Comprueba que las rutas están correctas en `App.tsx`

¡Éxito! 🚀
