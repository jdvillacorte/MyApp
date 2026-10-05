import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { supabase } from '@/lib/supabase';

export default function LoginScreen() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const iniciarSesion = async () => {
    if (!supabase) {
      setMensaje('Falta configurar la clave publica de Supabase.');
      return;
    }

    if (!correo.trim() || !contrasena) {
      setMensaje('Ingresa tu correo y contrasena.');
      return;
    }

    setCargando(true);
    setMensaje('');
    const { error } = await supabase.auth.signInWithPassword({
      email: correo.trim(),
      password: contrasena,
    });
    setCargando(false);

    if (error) {
      setMensaje('Correo o contrasena incorrectos.');
    }
  };

  return (
    <SafeAreaView style={styles.pantalla}>
      <View style={styles.contenido}>
        <View style={styles.marca}>
          <Text style={styles.marcaIniciales}>AS</Text>
        </View>
        <Text style={styles.titulo}>AutoSport</Text>
        <Text style={styles.subtitulo}>Inicia sesion para acceder a tus deportivos.</Text>

        <Text style={styles.label}>Correo electronico</Text>
        <TextInput
          style={styles.input}
          placeholder="correo@dominio.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          value={correo}
          onChangeText={setCorreo}
        />

        <Text style={styles.label}>Contrasena</Text>
        <TextInput
          style={styles.input}
          placeholder="Minimo 6 caracteres"
          secureTextEntry
          autoComplete="password"
          value={contrasena}
          onChangeText={setContrasena}
          onSubmitEditing={iniciarSesion}
        />

        {mensaje ? <Text style={styles.mensaje}>{mensaje}</Text> : null}

        <Pressable style={styles.boton} onPress={iniciarSesion} disabled={cargando}>
          {cargando ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.botonTexto}>Iniciar sesion</Text>
          )}
        </Pressable>

        <Pressable style={styles.enlace} onPress={() => router.push('/registro')}>
          <Text style={styles.enlaceTexto}>No tienes cuenta? Registrate</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: { backgroundColor: '#eef2f6', flex: 1 },
  contenido: { flex: 1, justifyContent: 'center', padding: 24 },
  marca: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#dc2626',
    borderRadius: 8,
    height: 58,
    justifyContent: 'center',
    marginBottom: 16,
    width: 58,
  },
  marcaIniciales: { color: '#ffffff', fontSize: 20, fontWeight: '900' },
  titulo: { color: '#121826', fontSize: 32, fontWeight: '900', textAlign: 'center' },
  subtitulo: { color: '#536173', lineHeight: 21, marginBottom: 28, marginTop: 7, textAlign: 'center' },
  label: { color: '#172033', fontWeight: '800', marginBottom: 7 },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
    borderRadius: 8,
    borderWidth: 1,
    color: '#121826',
    fontSize: 16,
    marginBottom: 15,
    padding: 14,
  },
  mensaje: { color: '#b91c1c', lineHeight: 20, marginBottom: 13, textAlign: 'center' },
  boton: { alignItems: 'center', backgroundColor: '#dc2626', borderRadius: 8, padding: 15 },
  botonTexto: { color: '#ffffff', fontSize: 16, fontWeight: '900' },
  enlace: { alignItems: 'center', marginTop: 18, padding: 10 },
  enlaceTexto: { color: '#dc2626', fontWeight: '800' },
});
