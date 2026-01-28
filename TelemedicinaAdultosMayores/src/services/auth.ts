import { supabase } from '../lib/supabase'

export interface RegistroData {
  nombreUsuario: string
  nombre: string
  apellido: string
  correo: string
  contraseña: string
  pais: string
  fechaNacimiento: string
  tipoUsuario: 'adultoMayor' | 'cuidador' | 'medico'
}

export interface LoginResponse {
  success: boolean
  user?: any
  error?: string
  rol?: string
}

/**
 * Inicia sesión con email y contraseña
 * También permite buscar por nombre de usuario
 */
export const login = async (identificador: string, password: string): Promise<LoginResponse> => {
  try {
    let email = identificador

    // Si no es un email, buscar el email asociado al nombre de usuario
    if (!identificador.includes('@')) {
      const { data: usuarioData, error: usuarioError } = await supabase
        .rpc('buscar_usuario_por_nombre', { nombre_usuario_buscar: identificador })
        .maybeSingle()

      if (usuarioError) {
        console.error('Error al buscar usuario:', usuarioError);
        return {
          success: false,
          error: 'Error al buscar usuario en la base de datos'
        }
      }

      if (!usuarioData || !usuarioData.correo) {
        console.error('Usuario no encontrado en tabla usuarios:', identificador);
        return {
          success: false,
          error: 'Usuario no registrado. Por favor verifica tu nombre de usuario.'
        }
      }

      console.log('Usuario encontrado:', usuarioData.nombre_usuario);
      email = usuarioData.correo
    }

    // Intentar login con Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      if (error.message.includes('Invalid login credentials') || error.message.includes('Email not confirmed')) {
        return {
          success: false,
          error: 'Contraseña incorrecta o usuario no confirmado'
        }
      }
      return {
        success: false,
        error: error.message || 'Error al iniciar sesión'
      }
    }

    if (!data.user) {
      return {
        success: false,
        error: 'No se pudo obtener la información del usuario'
      }
    }

    // Obtener el rol del usuario desde la tabla usuarios
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('tipo_usuario')
      .eq('id', data.user.id)
      .single()

    const rol = userData?.tipo_usuario || 'adultoMayor'

    // Intentar obtener el perfil completo del usuario y guardarlo en localStorage
    try {
      const { data: perfilData } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle()

      if (perfilData) {
        localStorage.setItem('usuario_perfil', JSON.stringify(perfilData));
        window.dispatchEvent(new Event('userProfileChanged'));
      }
    } catch (err) {
      // no bloquear login por fallo al obtener perfil
      console.warn('No se pudo obtener perfil de usuario:', err);
    }

    // Guardar información en localStorage
    if (data.session) {
      localStorage.setItem('token', data.session.access_token)
      localStorage.setItem('userId', data.user.id)
      localStorage.setItem('rol', rol)
    }

    return {
      success: true,
      user: data.user,
      rol
    }
  } catch (error: any) {
    console.error('Error en login:', error)
    return {
      success: false,
      error: error.message || 'Error inesperado al iniciar sesión'
    }
  }
}

/**
 * Registra un nuevo usuario en Supabase Auth y en la tabla usuarios
 */
export const registrar = async (datos: RegistroData): Promise<{ success: boolean; error?: string; user?: any }> => {
  try {
    // Validar unicidad de nombre_usuario
    const { data: usuarioExistente, error: checkError1 } = await supabase
      .from('usuarios')
      .select('id')
      .eq('nombre_usuario', datos.nombreUsuario)
      .maybeSingle()

    if (usuarioExistente) {
      return {
        success: false,
        error: 'El nombre de usuario ya está registrado'
      }
    }

    // Validar unicidad de correo
    const { data: correoExistente, error: checkError2 } = await supabase
      .from('usuarios')
      .select('id')
      .eq('correo', datos.correo)
      .maybeSingle()

    if (correoExistente) {
      return {
        success: false,
        error: 'El correo electrónico ya está registrado'
      }
    }

    if (checkError1 || checkError2) {
      console.error('Error al verificar unicidad:', checkError1 || checkError2);
      return {
        success: false,
        error: 'Error al verificar disponibilidad'
      }
    }

    // 1. Registrar usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: datos.correo,
      password: datos.contraseña,
      options: {
        data: {
          nombre: datos.nombre,
          apellido: datos.apellido,
          nombreUsuario: datos.nombreUsuario,
          pais: datos.pais,
          fechaNacimiento: datos.fechaNacimiento,
          tipoUsuario: datos.tipoUsuario
        }
      }
    })

    if (authError) {
      return {
        success: false,
        error: authError.message || 'Error al registrar usuario'
      }
    }

    if (!authData.user) {
      return {
        success: false,
        error: 'No se pudo crear el usuario'
      }
    }

    // 2. Guardar datos del usuario en la tabla usando función SQL (sin RLS)
    try {
      console.log('Guardando usuario en BD:', authData.user.id);
      const { error: dbError } = await supabase.rpc('register_user', {
        user_id: authData.user.id,
        p_nombre: datos.nombre,
        p_apellido: datos.apellido,
        p_nombre_usuario: datos.nombreUsuario,
        p_correo: datos.correo,
        p_pais: datos.pais,
        p_fecha_nacimiento: datos.fechaNacimiento,
        p_tipo_usuario: datos.tipoUsuario
      })

      if (dbError) {
        console.error('❌ Error al guardar en BD:', dbError);
        return {
          success: false,
          error: `Error al guardar datos: ${dbError.message}`
        }
      }

      console.log('✅ Usuario guardado correctamente en BD');
      
      // Si hay sesión inmediata, el usuario está completamente registrado
      if (authData.session) {
        return {
          success: true,
          user: authData.user
        }
      }

      // Si requiere confirmación de email, avisar al usuario
      return {
        success: true,
        user: authData.user,
        message: 'Usuario creado. Por favor confirma tu email.'
      }
    } catch (error: any) {
      console.error('❌ Error al insertar en BD:', error);
      return {
        success: false,
        error: error.message || 'Error al guardar datos del usuario'
      }
    }
  } catch (error: any) {
    console.error('Error en registro:', error)
    return {
      success: false,
      error: error.message || 'Error inesperado al registrar usuario'
    }
  }
}

/**
 * Cierra la sesión del usuario actual
 */
export const logout = async (): Promise<void> => {
  try {
    await supabase.auth.signOut()
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('rol')
    localStorage.removeItem('usuarioRecordado')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}

/**
 * Obtiene el usuario actual autenticado
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error('Error al obtener usuario actual:', error)
    return null
  }
}

/**
 * Obtiene la sesión actual
 */
export const getCurrentSession = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error('Error al obtener sesión actual:', error)
    return null
  }
}

/**
 * Verifica si el usuario está autenticado
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const session = await getCurrentSession()
  return !!session
}