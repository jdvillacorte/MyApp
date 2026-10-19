import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
assert(url && key, 'Carga las variables de .env.local antes de ejecutar la prueba.');
const carpeta = new URL('../artifacts/entrega/', import.meta.url);
await mkdir(carpeta, { recursive: true });
const resultados = [];
const clientesAuth = [];
const crearCliente = (storageKey) => {
  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storageKey },
    global: {
      fetch: (input, options) => fetch(input, {
        ...options,
        signal: AbortSignal.timeout(15000),
      }),
    },
  });
  clientesAuth.push(client);
  return client;
};
const comprobar = (nombre, condicion) => {
  assert(condicion, nombre);
  resultados.push({ prueba: nombre, correcto: true });
  console.log(`OK: ${nombre}`);
};

try {
  const publico = crearCliente('verificacion-publica');
  const catalogo = await publico.from('vehiculos').select('id');
  comprobar('Catalogo disponible', !catalogo.error && catalogo.data.length >= 4);
  const sinSesion = await publico.from('clientes').select('id');
  comprobar('Clientes bloqueados sin sesion', Boolean(sinSesion.error));

  if (!process.argv.includes('--escritura')) {
    console.log('Para probar cuentas y guardado usa --escritura. Crea datos de prueba identificados.');
  } else {
    let cuentas;
    try {
      cuentas = JSON.parse(await readFile(new URL('cuentas-prueba.json', carpeta), 'utf8'));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      const sufijo = Date.now();
      cuentas = [1, 2].map((numero) => ({
        email: `autosport.entrega.${sufijo}.${numero}@example.com`,
        password: `${randomUUID()}Aa1!`,
        nombre: `Verificacion AutoSport ${numero}`,
      }));
      await writeFile(new URL('cuentas-prueba.json', carpeta), JSON.stringify(cuentas, null, 2));
    }
    for (const cuenta of cuentas) {
        const registro = crearCliente(`registro-${cuenta.email}`);
        const existente = await registro.auth.signInWithPassword(cuenta);
        if (existente.data.session) {
          comprobar(`Cuenta disponible: ${cuenta.nombre}`, true);
          await registro.auth.signOut();
          continue;
        }
        if (existente.error?.code !== 'invalid_credentials') throw existente.error;
        const { data, error } = await registro.auth.signUp({
          email: cuenta.email, password: cuenta.password,
          options: { data: { nombre: cuenta.nombre } },
        });
        assert.ifError(error);
        comprobar(`Cuenta creada: ${cuenta.nombre}`, Boolean(data.user));
        await registro.auth.signOut();
    }

    const principal = crearCliente('prueba-principal');
    const incorrecto = await principal.auth.signInWithPassword({ email: cuentas[0].email, password: 'Incorrecta-123!' });
    comprobar('Contrasena incorrecta rechazada', Boolean(incorrecto.error) && !incorrecto.data.session);
    const login = await principal.auth.signInWithPassword(cuentas[0]);
    assert.ifError(login.error);
    comprobar('Inicio de sesion correcto', Boolean(login.data.session));
    const usuarioId = login.data.user.id;
    const perfil = await principal.from('perfiles').select('id').eq('id', usuarioId).single();
    comprobar('Perfil creado automaticamente', !perfil.error && perfil.data.id === usuarioId);

    const campos = 'id,nombre,correo,telefono,ciudad,vehiculo_favorito,tipo_compra,creado_en';
    let cliente = await principal.from('clientes').select(campos).eq('correo', cuentas[0].email).maybeSingle();
    assert.ifError(cliente.error);
    if (!cliente.data) {
      cliente = await principal.from('clientes').insert({
        nombre: 'Verificacion entrega AutoSport', correo: cuentas[0].email,
        telefono: '3000000000', ciudad: 'Pasto', tipo_compra: 'Contado',
        vehiculo_favorito: 'Ford Mustang GT Need for Speed', usuario_id: usuarioId,
      }).select(campos).single();
    }
    assert.ifError(cliente.error);
    comprobar('INSERT devuelve fila con vehiculo y tipo de compra', Boolean(cliente.data.id)
      && cliente.data.vehiculo_favorito === 'Ford Mustang GT Need for Speed'
      && cliente.data.tipo_compra === 'Contado');
    const listado = await principal.from('clientes').select(campos);
    comprobar('Lista con minimo tres clientes', !listado.error && listado.data.length >= 3);

    const pedido = await principal.from('pedidos').select('id').eq('usuario_id', usuarioId).limit(1);
    assert.ifError(pedido.error);
    if (!pedido.data.length) {
      const guardado = await principal.from('pedidos').insert({
        vehiculo_id: '1', marca: 'Mustang', modelo: 'PRUEBA ACADEMICA - SIN COMPRA REAL',
        precio: '$285.000.000 COP', nombre: cuentas[0].nombre,
        telefono: '3000000000', ciudad: 'Pasto', financiado: false, usuario_id: usuarioId,
      }).select('id').single();
      assert.ifError(guardado.error);
      comprobar('Pedido confirmado por Supabase', Boolean(guardado.data.id));
    } else {
      comprobar('Pedido de prueba almacenado', Boolean(pedido.data[0].id));
    }

    const segunda = crearCliente('prueba-segunda');
    const loginDos = await segunda.auth.signInWithPassword(cuentas[1]);
    assert.ifError(loginDos.error);
    const ajeno = await segunda.from('clientes').select('id').eq('id', cliente.data.id);
    comprobar('RLS bloquea el cliente de otro usuario', !ajeno.error && ajeno.data.length === 0);
    const suplantacion = await segunda.from('clientes').insert({
      nombre: 'Prueba rechazada', correo: cuentas[1].email,
      telefono: '3000000000', ciudad: 'Pasto', tipo_compra: 'Otro',
      vehiculo_favorito: 'Toyota GR Supra', usuario_id: usuarioId,
    });
    comprobar('RLS rechaza guardar a nombre de otro usuario', Boolean(suplantacion.error));
    await segunda.auth.signOut();
    const salida = await principal.auth.signOut();
    const sesion = await principal.auth.getSession();
    comprobar('Cerrar sesion elimina la sesion', !salida.error && sesion.data.session === null);
  }
} finally {
  for (const client of clientesAuth) client.auth.stopAutoRefresh();
  await writeFile(new URL('verificacion-supabase.json', carpeta), JSON.stringify({
    fecha: new Date().toISOString(), resultados,
  }, null, 2));
}
