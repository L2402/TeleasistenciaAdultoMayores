# 📋 Instrucciones para Habilitar Realtime en Mensajes

Para que el sistema de mensajes funcione en tiempo real, necesitas habilitar Supabase Realtime en la tabla `mensajes`.

## Pasos:

### 1. Abre Supabase SQL Editor
- Ir a tu proyecto Supabase en https://supabase.com
- Selecciona tu proyecto: **pcbqllsmphpturmmkxii**
- En el menú lateral, ve a **SQL Editor**
- Haz clic en **+ New Query**

### 2. Habilitar Realtime en la tabla mensajes

```sql
-- Habilitar Realtime para la tabla mensajes
ALTER PUBLICATION supabase_realtime ADD TABLE mensajes;
```

Haz clic en **Run** (o presiona Ctrl+Enter)

### 3. Verificar que funciona

```sql
-- Ver todas las tablas con Realtime habilitado
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
```

Deberías ver `mensajes` en la lista.

### 4. ¡Listo!

Ahora cuando alguien envíe un mensaje:
- ✅ Aparecerá instantáneamente en la conversación
- ✅ Sin necesidad de recargar la página
- ✅ Funciona para todos los usuarios conectados

## ¿Cómo funciona?

- Cuando alguien envía un mensaje (INSERT en la tabla), Supabase envía una notificación en tiempo real
- El componente de chat detecta el nuevo mensaje y lo muestra automáticamente
- Los mensajes se marcan como leídos cuando el usuario abre la conversación

## 🎯 Características del Sistema de Mensajes

### Para Médicos:
- ✅ Ve lista de sus pacientes asignados
- ✅ Selecciona paciente y chatea en tiempo real
- ✅ Historial completo de conversaciones

### Para Cuidadores:
- ✅ Ve lista de adultos a cargo
- ✅ Selecciona adulto y chatea en tiempo real
- ✅ Historial completo de conversaciones

### Para Adultos Mayores:
- ✅ Ve automáticamente todos sus doctores y cuidadores
- ✅ No necesita filtro, aparecen automáticamente
- ✅ Puede chatear con cualquiera que lo tenga asignado

## 📌 Nota de Seguridad

Las políticas RLS existentes en la tabla `mensajes` ya controlan que:
- Solo puedes ver mensajes donde eres remitente o destinatario
- Solo puedes enviar mensajes como tú mismo
- No puedes ver conversaciones de otros usuarios
