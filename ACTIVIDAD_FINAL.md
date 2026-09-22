# Actividad final adaptada: AutoSport

En AutoSport, el campo **Tipo de preparacion** de Coffee App se adapta a
**Tipo de compra**. Las opciones disponibles son Contado, Credito, Leasing,
Permuta y Otro. La tabla equivalente a `clientes_cafe` es `clientes`, y la
pantalla equivalente a Coffee Lovers es `registros.tsx`, titulada **Clientes
AutoSport**.

## Preguntas de cierre

### 1. ¿Que funcion cumple `.from()`?

`.from('clientes')` indica la tabla o vista de Supabase sobre la que se va a
realizar la operacion. A partir de ahi se puede encadenar una consulta como
`.insert()` o `.select()`.

### 2. ¿Cual es la diferencia entre `.insert()` y `.select()`?

`.insert()` crea una o varias filas nuevas en la tabla. `.select()` consulta y
devuelve filas que ya estan almacenadas. En AutoSport, el formulario usa
`.insert()` y la pantalla Clientes AutoSport usa `.select()`.

### 3. ¿Por que debemos comprobar `data` y `error`?

`data` contiene el resultado exitoso de la operacion y `error` explica por que
fallo. Comprobar ambos evita mostrar informacion inexistente y permite informar
al usuario cuando hay problemas de conexion, permisos o validacion.

### 4. ¿Que funcion cumple RLS?

RLS (Row Level Security) protege las filas de PostgreSQL mediante politicas.
Define que usuarios o roles pueden consultar, insertar, actualizar o eliminar
datos, incluso cuando acceden desde la API publica de Supabase.

### 5. ¿Que diferencia existe entre guardar un dato en `useState` y guardarlo en Supabase?

`useState` mantiene el dato temporalmente en la memoria de una pantalla; puede
perderse al cerrarla o reiniciar la aplicacion. Supabase lo guarda de forma
persistente en PostgreSQL, por lo que puede recuperarse despues desde otro
inicio de la aplicacion o dispositivo, sujeto a las politicas de acceso.

## Evidencias solicitadas

- Formulario: `src/app/formulario.tsx` incluye el selector Tipo de compra.
- Resultado: `src/app/resultado.tsx` muestra el tipo elegido.
- Registros: `src/app/registros.tsx` consulta y presenta Clientes AutoSport.
- Base de datos: la migracion crea `tipo_compra` y tres registros de ejemplo.
- Persistencia: los registros se consultan nuevamente desde Supabase.
