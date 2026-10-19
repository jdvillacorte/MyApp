# Entrega final de AutoSport

AutoSport integra los cinco laboratorios en el mismo proyecto Expo. La tienda presenta Mustang, Corvette, Ferrari y Toyota, precios en pesos colombianos, formularios, consultas persistentes, cuentas y rutas protegidas.

## Adaptacion de los ejemplos

| Coffee App | AutoSport |
| --- | --- |
| Cafe favorito | Vehiculo de interes, columna `vehiculo_favorito` |
| Tipo de preparacion | Tipo de compra, columna `tipo_compra` |
| clientes_cafe | Tabla `clientes` |
| Coffee Lovers | Pantalla Clientes AutoSport |
| Productos de cafeteria | Catalogo de cuatro deportivos |
| Cafe y rosa pastel | Rojo, blanco y gris de AutoSport |

Los grupos `(auth)` y `(app)` organizan las rutas sin alterar sus direcciones visibles. Login y Crear cuenta son publicos. Inicio, catalogo, formulario, resultado, clientes, galeria, contacto y producto requieren sesion.

## Matriz de requisitos

| Laboratorio | Requisito adaptado | Implementacion |
| --- | --- | --- |
| Componentes | Nombre, encabezado y descripcion propios | Inicio y Login de AutoSport |
| Componentes | Dos productos y dos imagenes como minimo | Cuatro deportivos con fotos locales |
| Componentes | Formulario con tres campos o mas | Cliente y formulario de compra |
| Componentes | TextInput, useState, onChangeText | Formularios y autenticacion |
| Componentes | Pressable, onPress y validaciones | Guardar, comprar, registro y Login |
| Componentes | Resultado en la misma pantalla | Confirmacion al volver al formulario y modal de compra |
| Componentes | ScrollView y estilos propios | Pantallas de la tienda |
| Expo Router | Navegacion por archivos, Stack y useRouter | `src/app`, layouts publicos y privados |
| Expo Router | Parametros y useLocalSearchParams | Resultado y detalle del vehiculo |
| Expo Router | Inicio, formulario, resultados, imagenes y contacto | Rutas existentes conservadas |
| Supabase | Almacenamiento permanente e INSERT | `clientes`, con fila devuelta por `.select().single()` |
| Supabase | Vehiculo favorito y tipo de compra | Formulario, INSERT, resultado y tarjetas de clientes |
| Supabase | Consulta SELECT, FlatList y carga | Clientes AutoSport, con actualizacion por gesto y boton |
| Supabase | Minimo tres registros | Laura Martinez, Carlos Rodriguez y Sofia Hernandez son demostraciones existentes |
| Supabase | RLS | Nuevos registros vinculados al UID; cada cuenta consulta sus clientes y las demostraciones anteriores |
| Auth | Registro y Login separados | `(auth)/registro.tsx` y `(auth)/login.tsx` |
| Auth | AsyncStorage y persistencia | `src/lib/auth-storage.ts` |
| Auth | getSession y onAuthStateChange | `src/context/AuthContext.tsx` |
| Auth | Stack.Protected y carga inicial | `src/app/_layout.tsx` |
| Auth | Cerrar sesion | Boton del inicio y signOut |
| APK | Package, proyecto EAS y perfil APK | `app.json` y `eas.json`, perfil preview |
| APK | Archivo instalable con codigo final | Debe usarse el build generado despues de estos cambios |

Las filas cuyo `usuario_id` es nulo son registros heredados y demostraciones visibles para cuentas autenticadas. Los registros nuevos requieren el UID de la sesion. Las contrasenas pertenecen a Supabase Auth y nunca se guardan en `clientes` ni `perfiles`.

## Ejecucion y verificacion

```powershell
npm install
npx tsc --noEmit
npx expo-doctor
npx expo start -c
```

Configure `.env.local` con `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Las variables `VITE_` corresponden a otros proyectos y no son leidas por esta app Expo. Nunca incluya la contrasena de PostgreSQL ni una clave secreta en el cliente movil.

Para la prueba de conexion reproducible:

```powershell
node --env-file=.env.local scripts/verificar-supabase.mjs
node --env-file=.env.local scripts/verificar-supabase.mjs --escritura
```

La segunda orden crea dos cuentas de integracion y datos de prueba identificados. Guarda el informe y credenciales de prueba en `artifacts/entrega`, carpeta excluida de Git. No sustituye las capturas del registro desde la interfaz que pide la profesora. No publique el archivo de credenciales.

## Prueba en Android Studio

1. Abra Android Studio y entre en Device Manager.
2. Inicie el dispositivo virtual Medium Phone, o cree uno con una imagen Android reciente.
3. Desde la carpeta del proyecto ejecute `npx expo start -c`.
4. Presione `a` para abrir la app en el emulador. Expo Go debe ser compatible con SDK 57.
5. Cree una cuenta desde Crear cuenta y vuelva al Login.
6. Pruebe primero una contrasena incorrecta y luego la correcta.
7. Abra Formulario, complete todos los campos, elija el vehiculo y el tipo de compra.
8. Guarde, revise Resultado y vuelva al formulario para ver la confirmacion conservada.
9. Entre en Clientes AutoSport y actualice la lista.
10. Verifique galeria, contacto y el detalle de los cuatro vehiculos.
11. Cierre completamente la app sin cerrar sesion y vuelva a abrirla. Debe recuperar la sesion.
12. Cierre sesion desde el inicio. Las pantallas privadas deben volver a quedar bloqueadas.

## Generacion e instalacion de la APK

El proyecto EAS ya esta vinculado a `@cywolf/miapp-6e`. Se conserva `com.estudiante.miapp6e` para mantener la identidad de instalacion. El nombre visible es AutoSport.

```powershell
eas whoami
npx expo config
eas build -p android --profile preview
```

El entorno `preview` de EAS debe contener las dos variables publicas de Supabase. Al finalizar, descargue el archivo APK desde el enlace del build. No use un APK anterior para demostrar funciones agregadas despues de su compilacion.

Para instalar en el emulador, arrastre el APK sobre la pantalla de Android Studio o ejecute:

```powershell
& "$env:LOCALAPPDATA/Android/Sdk/platform-tools/adb.exe" install -r "RUTA_ABSOLUTA_DE_LA_APK"
```

Despues de instalar, registre un cliente desde esa APK y compruebe su identificador en Supabase. Un build exitoso por si solo no demuestra que ese registro se hizo desde la APK.

## Evidencias que deben acompanar la entrega

- [ ] Inicio de AutoSport.
- [ ] Formulario diligenciado con vehiculo y tipo de compra.
- [ ] Resultado con los datos devueltos por Supabase y codigo del registro.
- [ ] Confirmacion en la misma pantalla o modal de compra.
- [ ] Galeria con las cuatro fotos.
- [ ] Pantalla de contacto.
- [ ] Clientes AutoSport con tres registros o mas.
- [ ] Table Editor, tabla `clientes`, con las filas correspondientes.
- [ ] Pantalla Crear cuenta.
- [ ] Authentication > Users con dos usuarios creados desde la app.
- [ ] Login y mensaje de contrasena incorrecta.
- [ ] Inicio despues de autenticar correctamente.
- [ ] Evidencia de cerrar y abrir conservando sesion.
- [ ] Boton Cerrar sesion y regreso al Login.
- [ ] Build final exitoso en EAS y archivo APK descargado.
- [ ] App instalada en Android y registro hecho desde esa APK.
- [ ] Mismo registro de la APK identificado en Supabase.
- [ ] Codigo fuente actualizado y respuestas de este documento.

La lista queda sin marcar para no presentar como realizadas capturas que aun no se hayan tomado. Los archivos de capturas y APK anteriores se conservan en `artifacts`, pero deben contrastarse con la version final.

## Respuestas del laboratorio de componentes

1. **View:** agrupa y organiza componentes visuales, como el encabezado, una tarjeta o una fila.
2. **Text y TextInput:** Text muestra informacion; TextInput permite que el usuario escriba.
3. **useState:** conserva valores temporales y provoca una actualizacion visual cuando cambian.
4. **onChangeText:** recibe el texto escrito y actualiza el estado asociado al campo.
5. **onPress:** ejecuta una funcion al presionar un boton.
6. **mostrarPedido:** en el ejemplo valida y construye el resumen. En AutoSport esa responsabilidad se adapta a confirmarCompra y enviar, que validan, guardan y muestran el resultado.
7. **trim:** elimina espacios al principio y al final, evitando aceptar campos compuestos solo por espacios.
8. **Renderizado condicional:** muestra u oculta componentes segun el estado, como errores, carga y confirmaciones.
9. **ScrollView:** permite recorrer contenido que excede el alto de la pantalla.
10. **Imagen local y remota:** una local usa `require` y se incluye en el paquete; una remota usa `{ uri: direccion }` y depende del servidor y de la conexion. AutoSport conserva URLs de referencia y usa copias locales de las cuatro fotos.
11. **StyleSheet:** organiza estilos de colores, dimensiones, tipografia, alineacion y separacion.

## Respuestas del laboratorio de rutas

1. **Archivo y ruta:** `formulario.tsx` crea `/formulario`; `producto/[id].tsx` crea una ruta con parametro dinamico. Los grupos entre parentesis no forman parte de la direccion visible.
2. **push y replace:** push agrega una pantalla al historial; replace sustituye la pantalla actual. El formulario usa push para permitir volver a su confirmacion; regresar al inicio desde resultado usa replace.
3. **useLocalSearchParams:** recupera los parametros de la ruta, como los datos guardados o el identificador del vehiculo.
4. **useState en el formulario:** mantiene los campos, la seleccion, el estado de envio y el resultado mientras existe la pantalla.
5. **Local y uri:** la imagen local viaja dentro de la app; uri solicita el recurso a una direccion. Las cuatro imagenes principales funcionan sin descargar fotos durante el uso.

## Respuestas del laboratorio de Supabase

1. **from():** selecciona la tabla sobre la que se ejecuta la operacion, por ejemplo `clientes`.
2. **insert y select:** insert crea filas; select consulta filas. Encadenar select despues de insert devuelve el registro creado.
3. **data y error:** error permite detectar un fallo y data confirma que existe un resultado valido. No se debe mostrar exito solo porque el usuario presiono Guardar.
4. **RLS:** aplica reglas de acceso por fila en PostgreSQL. En AutoSport exige el UID al guardar y limita los datos de cada cuenta.
5. **useState y Supabase:** useState conserva datos temporales de la interfaz; Supabase los almacena en PostgreSQL y permite recuperarlos despues de cerrar la aplicacion.

## Respuestas del laboratorio de autenticacion

1. **signUp y signInWithPassword:** signUp crea una cuenta; signInWithPassword comprueba las credenciales de una cuenta existente y obtiene una sesion.
2. **Sesion:** identifica al usuario autenticado e incluye los tokens necesarios para acceder a operaciones protegidas.
3. **AsyncStorage:** conserva la sesion localmente en Android para recuperarla al abrir la app de nuevo. No reemplaza PostgreSQL.
4. **onAuthStateChange:** escucha inicio, cierre y renovacion de sesion, actualizando el contexto y la navegacion.
5. **Ruta publica y protegida:** Login y Registro pueden abrirse sin sesion; las pantallas de AutoSport requieren autenticacion.
6. **signOut:** elimina la sesion; el contexto recibe null y Stack.Protected bloquea la zona privada.
7. **Rutas y RLS:** proteger pantallas no reemplaza RLS. Las rutas controlan la navegacion; RLS protege las filas incluso ante llamadas directas a la API.

## Conceptos de la APK

- **APK:** archivo firmado que se instala directamente en Android.
- **AAB:** formato usado normalmente para distribucion mediante Google Play.
- **Package:** identificador Android de la aplicacion.
- **Keystore:** credencial usada para firmar y actualizar la app.
- **preview:** perfil EAS que produce una APK instalable mediante `buildType: apk`.

## Fuentes de requisitos

Revision basada en los cinco documentos proporcionados: Laboratorio de Login y Rutas Protegidas, Laboratorio Supabase, Guia Expo Router, Guia de Componentes Formulario y Eventos, y Guia de Generacion APK con Expo EAS. Sus ejemplos de Coffee App se adaptan a la tienda de deportivos; el proyecto existente, sus rutas y sus tablas se conservan.
