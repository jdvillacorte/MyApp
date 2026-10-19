# AutoSport

Tienda academica de autos deportivos construida con Expo 57, Expo Router y Supabase.

La revision de los cinco laboratorios, las equivalencias con Coffee App, las respuestas y las evidencias estan en [Entrega final](docs/ENTREGA_FINAL_AUTOSPORT.md).

## Configurar Supabase

1. Cree `.env.local` a partir de `.env.example`.
2. Configure `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` con el proyecto de AutoSport.
3. Para una base nueva, aplique las migraciones de `supabase/migrations` en orden cronologico. La base existente ya contiene las tablas y la migracion de entrega.
4. Reinicie Expo con `npx expo start -c`.

La app usa la Data API. No agregue la contrasena de PostgreSQL ni claves secretas a variables `EXPO_PUBLIC_*` o al repositorio.

## Ejecutar y verificar

```bash
npm install
npm run typecheck
npx expo-doctor
npm run verify:supabase
npx expo start -c
```

El verificador es de lectura por defecto. `npm run verify:supabase -- --escritura` crea cuentas y registros identificados como pruebas; guarda el informe y las credenciales de prueba en la carpeta local excluida de Git `artifacts/entrega`.

## APK

```bash
eas whoami
eas build -p android --profile preview
```

El entorno `preview` de EAS debe incluir las dos variables publicas de Supabase. Para Android Studio, instalacion del APK, pruebas y capturas, siga el documento de entrega.

Las rutas publicas son Login y Registro. Catalogo, formulario, resultado, clientes, galeria, contacto y compras requieren sesion. RLS protege los clientes y pedidos nuevos por UID y conserva visibles las demostraciones heredadas a usuarios autenticados.
