# 📋 Instrucciones para Ejecutar las Funciones SQL del Cuidador

Para que las nuevas interfaces del cuidador funcionen correctamente, necesitas ejecutar dos funciones SQL en Supabase.

## Pasos:

### 1. Abre Supabase SQL Editor
- Ir a tu proyecto Supabase en https://supabase.com
- Selecciona tu proyecto: **pcbqllsmphpturmmkxii**
- En el menú lateral, ve a **SQL Editor** (icono de base de datos)
- Haz clic en **+ New Query**

### 2. Copia y pega la primera función (buscar_adultos_mayores)

```sql
DROP FUNCTION IF EXISTS buscar_adultos_mayores();

CREATE OR REPLACE FUNCTION buscar_adultos_mayores()
RETURNS TABLE (
  id UUID,
  nombre TEXT,
  apellido TEXT,
  correo TEXT,
  fecha_nacimiento DATE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.nombre::TEXT,
    u.apellido::TEXT,
    u.correo::TEXT,
    u.fecha_nacimiento
  FROM usuarios u
  WHERE u.tipo_usuario = 'adultoMayor'
  ORDER BY u.nombre, u.apellido;
END;
$$;
```

Haz clic en **Run** (botón rojo abajo a la derecha) o presiona **Ctrl+Enter**

### 3. Copia y pega la segunda función (obtener_adultos_cuidador)

```sql
DROP FUNCTION IF EXISTS obtener_adultos_cuidador(UUID);

CREATE OR REPLACE FUNCTION obtener_adultos_cuidador(cuidador_id_param UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_agg(
    json_build_object(
      'id', u.id,
      'nombre', u.nombre::TEXT,
      'apellido', u.apellido::TEXT,
      'correo', u.correo::TEXT,
      'fecha_nacimiento', u.fecha_nacimiento
    )
  )
  INTO result
  FROM usuarios u
  INNER JOIN adulto_cuidador ac ON u.id = ac.adulto_id
  WHERE ac.cuidador_id = cuidador_id_param
    AND ac.activo = true
    AND u.tipo_usuario = 'adultoMayor';
  
  RETURN COALESCE(result, '[]'::json);
END;
$$;
```

Haz clic en **Run** de nuevo.

### 4. ¡Listo! 

Ahora deberías ver un mensaje de éxito en ambas consultas. Las nuevas interfaces del cuidador ya están listas para usar.

## ¿Qué hacen estas funciones?

- **buscar_adultos_mayores()**: Devuelve una lista de TODOS los adultos mayores del sistema. El cuidador usa esto para buscar y agregar adultos a su lista.

- **obtener_adultos_cuidador(UUID)**: Devuelve SOLO los adultos mayores asignados a un cuidador específico. Se usa en las vistas de citas y medicamentos.

Ambas usan `SECURITY DEFINER` para bypass RLS, lo que permite al cuidador ver los datos de sus adultos asignados.

## 📌 Nota Importante

**Las funciones usan `ac.adulto_id`** (no `adulto_mayor_id`) porque esa es la columna correcta en tu tabla `adulto_cuidador`.

