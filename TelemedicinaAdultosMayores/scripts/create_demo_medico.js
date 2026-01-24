/*
Script para crear un usuario médico de prueba en Supabase.
USO:
  - Exporta las variables de entorno:
      SUPABASE_URL
      SUPABASE_SERVICE_ROLE_KEY
  - Ejecuta: node scripts/create_demo_medico.js

Este script usa la key de servicio (service_role) y debe ejecutarse en un entorno seguro (no en el navegador).
*/

const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error('Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey);

async function run() {
  try {
    const demoEmail = 'medico.demo@example.com';
    const demoPassword = 'MedicoDemo123';
    const nombre = 'Médico';
    const apellido = 'Demo';
    const nombreUsuario = 'medico_demo';

    // Crear usuario en Auth (método admin)
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email: demoEmail,
      password: demoPassword,
      email_confirm: true,
      user_metadata: {
        nombre,
        apellido,
        nombreUsuario
      }
    });

    if (createError) {
      console.error('Error creando usuario:', createError.message || createError);
      process.exit(1);
    }

    const userId = userData?.id;
    console.log('Usuario creado con id:', userId);

    // Insertar en tabla usuarios
    const { error: insertError } = await supabase.from('usuarios').insert([{ 
      id: userId,
      nombre,
      apellido,
      nombre_usuario: nombreUsuario,
      correo: demoEmail,
      pais: 'N/A',
      fecha_nacimiento: '1970-01-01',
      tipo_usuario: 'medico',
      created_at: new Date().toISOString()
    }]);

    if (insertError) {
      console.error('Error insertando en tabla usuarios:', insertError.message || insertError);
      process.exit(1);
    }

    console.log('Usuario médico de prueba creado correctamente. Credenciales:');
    console.log('  email:', demoEmail);
    console.log('  password:', demoPassword);
    console.log('Inicia sesión en la app usando estas credenciales y selecciona el rol "Médico" en el selector.');
  } catch (err) {
    console.error('Error inesperado:', err);
    process.exit(1);
  }
}

run();
