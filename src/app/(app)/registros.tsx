import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { supabase } from '@/lib/supabase';

type Cliente = {
  id: string;
  nombre: string;
  ciudad: string;
  tipo_compra: string;
  creado_en: string;
};

export default function Registros() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
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
    const { data, error: errorSupabase } = await supabase
      .from('clientes')
      .select('id, nombre, ciudad, tipo_compra, creado_en')
      .order('creado_en', { ascending: false });

    if (errorSupabase) {
      setError('No fue posible consultar los clientes.');
      setClientes([]);
    } else {
      setClientes(data ?? []);
    }
    setCargando(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarClientes();
    }, [cargarClientes]),
  );

  return (
    <SafeAreaView style={styles.pantalla}>
      <ScrollView contentContainerStyle={styles.contenido}>
        <Text style={styles.titulo}>Clientes AutoSport</Text>
        <Text style={styles.subtitulo}>Personas que ya eligieron como comprar su proximo deportivo.</Text>

        {cargando ? <ActivityIndicator size="large" color="#dc2626" style={styles.carga} /> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {!cargando && !error && clientes.length === 0 ? (
          <Text style={styles.vacio}>Aun no hay clientes registrados.</Text>
        ) : null}

        {clientes.map((cliente) => (
          <View key={cliente.id} style={styles.tarjeta}>
            <View style={styles.avatar}>
              <Text style={styles.avatarTexto}>{cliente.nombre.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.nombre}>{cliente.nombre}</Text>
              <Text style={styles.detalle}>{cliente.ciudad}</Text>
              <Text style={styles.tipo}>{cliente.tipo_compra}</Text>
            </View>
          </View>
        ))}

        <Pressable style={styles.boton} onPress={cargarClientes} disabled={cargando}>
          <Text style={styles.botonTexto}>Actualizar registros</Text>
        </Pressable>
      </ScrollView>
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
