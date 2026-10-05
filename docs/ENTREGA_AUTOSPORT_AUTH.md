# Actividad final: AutoSport + Supabase Auth

Esta actividad adapta el laboratorio de Coffee App al proyecto AutoSport sin crear un proyecto nuevo.

## Equivalencias de la adaptacion

- Coffee App se reemplaza por AutoSport.
- La tematica cafe y rosa pastel se reemplaza por la identidad roja, blanca y gris de AutoSport.
- Coffee Lovers se reemplaza por Clientes AutoSport.
- Inicio, catalogo, formulario, resultado, clientes, galeria, contacto y compra de vehiculos son rutas privadas.
- Login y Crear cuenta son rutas publicas.

## Pruebas para la entrega

1. En Supabase, abra Authentication > Sign In / Providers.
2. Active Allow new users to sign up y desactive Confirm email para repetir exactamente el flujo del laboratorio.
3. Desde la pantalla Crear cuenta registre dos usuarios diferentes. Use correos de prueba que pueda identificar y contrasenas de minimo seis caracteres.
4. Compruebe ambos usuarios en Authentication > Users y tome la captura.
5. Cierre sesion e intente ingresar con una contrasena incorrecta. La app debe mostrar que las credenciales son incorrectas.
6. Inicie sesion correctamente y tome una captura del inicio de AutoSport.
7. Cierre completamente la app sin cerrar sesion. Al abrirla de nuevo debe mantenerse dentro de AutoSport.
8. Presione Cerrar sesion. Intente abrir una ruta privada y compruebe que vuelve al Login.

## Capturas requeridas

- Pantalla Crear cuenta de AutoSport.
- Supabase Authentication > Users con minimo dos usuarios.
- Pantalla Login de AutoSport.
- Inicio de AutoSport despues de iniciar sesion.
- Boton Cerrar sesion.
- Intento fallido con contrasena incorrecta.

## Preguntas de cierre

### 1. Que diferencia existe entre signUp() y signInWithPassword()?

`signUp()` crea un usuario nuevo en Supabase Auth. `signInWithPassword()` valida las credenciales de un usuario que ya existe y, si son correctas, crea una sesion autenticada.

### 2. Que funcion cumple una sesion?

La sesion representa que un usuario esta autenticado. Contiene los datos y tokens necesarios para mantener su acceso y permite decidir que pantallas puede utilizar.

### 3. Para que se utiliza AsyncStorage en este laboratorio?

AsyncStorage guarda localmente la sesion de Supabase en el dispositivo. Gracias a esto, AutoSport puede recuperar la autenticacion cuando la aplicacion se cierra y vuelve a abrirse.

### 4. Que funcion cumple onAuthStateChange()?

`onAuthStateChange()` escucha cambios de autenticacion, como iniciar sesion, renovar el token o cerrar sesion. El contexto actualiza `session` y las rutas protegidas reaccionan automaticamente.

### 5. Que diferencia existe entre una ruta publica y una ruta protegida?

Una ruta publica puede abrirse sin autenticacion, como Login o Crear cuenta. Una ruta protegida solo queda disponible cuando existe una sesion, como el catalogo, formularios y registros de AutoSport.

### 6. Que ocurre con session cuando se ejecuta signOut()?

Supabase elimina la sesion guardada y `session` pasa a ser `null`. Expo Router deshabilita el grupo privado y muestra nuevamente el Login.

### 7. Proteger una ruta reemplaza las politicas RLS de Supabase?

No. Las rutas protegidas controlan la navegacion dentro de la aplicacion, pero no protegen directamente la base de datos. RLS controla en PostgreSQL que filas puede consultar o modificar cada usuario, incluso si alguien intenta llamar la API fuera de la app. Deben utilizarse ambas protecciones.
