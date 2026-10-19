import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { supabase } from '@/lib/supabase';

import type { Cliente } from '@/types/cliente';

type ClienteResumen = Pick<Cliente, 'id' | 'nombre' | 'ciudad' | 'vehiculo_favorito' | 'tipo_compra' | 'creado_en'>;

export default function Registros() {
  const [clientes, setClientes] = useState<ClienteResumen[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargarClientes = useCallback(async () => {
    if (!supabase) {
      setError('Supabase no esta configurado.');
      setCargando(false);
      return;
    }

    setCargando(true);
    setError('');
    try {
      const { data, error: errorSupabase } = await supabase
      .from('clientes')
      .select('id, nombre, ciudad, vehiculo_favorito, tipo_compra, creado_en')
      .order('creado_en', { ascending: false });

      if (errorSupabase) {
        const mensaje = errorSupabase.message;
        if (/fetch|network|ENOTFOUND/i.test(mensaje)) {
          setError('No se pudo conectar con Supabase. Revisa tu conexion y que el proyecto este activo.');
        } else if (errorSupabase.code === '42501') {
          setError('Tu cuenta no tiene permiso para consultar los clientes. Revisa los permisos de la tabla en Supabase.');
        } else if (['42P01', 'PGRST205'].includes(errorSupabase.code)) {
          setError('La tabla clientes no esta disponible en el proyecto de Supabase configurado.');
        } else {
          setError(`No fue posible consultar los clientes: ${mensaje}`);
        }
        setClientes([]);
      } else {
        setClientes(data ?? []);
      }
    } catch {
      setClientes([]);
      setError('No se pudo conectar con Supabase. Revisa tu conexion y que el proyecto este activo.');
    } finally {
      setCargando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarClientes();
    }, [cargarClientes]),
  );

  return (
    <SafeAreaView style={styles.pantalla} edges={['left', 'right', 'bottom']}>
      <FlatList
        contentContainerStyle={styles.contenido}
        data={clientes}
        keyExtractor={(cliente) => cliente.id}
        refreshing={cargando}
        onRefresh={cargarClientes}
        ListHeaderComponent={<>
        <Text style={styles.titulo}>Clientes AutoSport</Text>
        <Text style={styles.subtitulo}>Personas que ya eligieron como comprar su proximo deportivo.</Text>

        {cargando ? <ActivityIndicator size="large" color="#dc2626" style={styles.carga} /> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {!cargando && !error && clientes.length === 0 ? (
          <Text style={styles.vacio}>Aun no hay clientes registrados.</Text>
        ) : null}

        </>}
        renderItem={({ item: cliente }) => (
          <View key={cliente.id} style={styles.tarjeta}>
            <View style={styles.avatar}>
              <Text style={styles.avatarTexto}>{cliente.nombre.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.nombre}>{cliente.nombre}</Text>
              <Text style={styles.detalle}>{cliente.ciudad}</Text>
              <Text style={styles.detalle}>{cliente.vehiculo_favorito}</Text>
              <Text style={styles.tipo}>{cliente.tipo_compra}</Text>
            </View>
          </View>
        )}
        ListFooterComponent={
        <Pressable style={styles.boton} onPress={cargarClientes} disabled={cargando}>
          <Text style={styles.botonTexto}>Actualizar registros</Text>
        </Pressable>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: '#eef2f6' },
  contenido: { padding: 20, paddingBottom: 40 },
  titulo: { color: '#121826', fontSize: 28, fontWeight: '900', marginTop: 12 },
  subtitulo: { color: '#536173', fontSize: 15, lineHeight: 22, marginTop: 7, marginBottom: 22 },
  carga: { marginVertical: 36 },
  error: { color: '#b91c1c', backgroundColor: '#fef2f2', padding: 14, borderRadius: 8 },
  vacio: { color: '#536173', textAlign: 'center', marginVertical: 36 },
  tarjeta: { alignItems: 'center', backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: 8, borderWidth: 1, flexDirection: 'row', marginBottom: 12, padding: 16 },
  avatar: { alignItems: 'center', backgroundColor: '#fee2e2', borderRadius: 8, height: 52, justifyContent: 'center', width: 52 },
  avatarTexto: { color: '#b91c1c', fontSize: 22, fontWeight: '900' },
  info: { flex: 1, marginLeft: 14 },
  nombre: { color: '#121826', fontSize: 17, fontWeight: '900' },
  detalle: { color: '#64748b', fontSize: 14, marginTop: 3 },
  tipo: { alignSelf: 'flex-start', color: '#b91c1c', fontSize: 13, fontWeight: '800', marginTop: 7 },
  boton: { alignItems: 'center', backgroundColor: '#dc2626', borderRadius: 8, marginTop: 12, paddingVertical: 15 },
  botonTexto: { color: '#ffffff', fontWeight: '900' },
});
