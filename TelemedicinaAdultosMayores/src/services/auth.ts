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
        .from('usuarios')
        .select('correo')
        .eq('nombre_usuario', identificador)
        .single()

      if (usuarioError || !usuarioData) {
        return {
          success: false,
          error: 'Usuario o contraseña incorrectos'
        }
      }

      email = usuarioData.correo
    }

    // Intentar login con Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
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

    // 2. Si hay sesión inmediata (confirmación de email deshabilitada), insertar directamente
    if (authData.session) {
      try {
        const { error: dbError } = await supabase
          .from('usuarios')
          .insert({
            id: authData.user.id,
            nombre: datos.nombre,
            apellido: datos.apellido,
            nombre_usuario: datos.nombreUsuario,
            correo: datos.correo,
            pais: datos.pais,
            fecha_nacimiento: datos.fechaNacimiento,
            tipo_usuario: datos.tipoUsuario,
            created_at: new Date().toISOString()
          })

        if (dbError) {
          console.error('Error al guardar en BD:', dbError)
          return {
            success: false,
            error: 'Usuario creado pero no se pudieron guardar los datos adicionales'
          }
        }

        return {
          success: true,
          user: authData.user
        }
      } catch (error: any) {
        console.error('Error al insertar en BD:', error)
        return {
          success: false,
          error: error.message || 'Error al guardar datos del usuario'
        }
      }
    }

    // 3. Si requiere confirmación de email, esperar evento SIGNED_IN
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        subscription.unsubscribe()
        resolve({
          success: true,
          user: authData.user,
          error: 'Usuario creado. Por favor confirma tu email para completar el registro.'
        })
      }, 5000) // Reducido a 5 segundos

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session) {
            clearTimeout(timeout)
            subscription.unsubscribe()
            
            try {
              const { error: dbError } = await supabase
                .from('usuarios')
                .insert({
                  id: session.user.id,
                  nombre: datos.nombre,
                  apellido: datos.apellido,
                  nombre_usuario: datos.nombreUsuario,
                  correo: datos.correo,
                  pais: datos.pais,
                  fecha_nacimiento: datos.fechaNacimiento,
                  tipo_usuario: datos.tipoUsuario,
                  created_at: new Date().toISOString()
                })

              if (dbError) {
                console.error('Error al guardar en BD:', dbError)
                resolve({
                  success: false,
                  error: 'Usuario creado pero no se pudieron guardar los datos adicionales'
                })
              } else {
                resolve({
                  success: true,
                  user: session.user
                })
              }
            } catch (error: any) {
              console.error('Error al insertar en BD:', error)
              resolve({
                success: false,
                error: error.message || 'Error al guardar datos del usuario'
              })
            }
          }
        }
      )
    })
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