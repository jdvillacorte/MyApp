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

type Modo = 'ingresar' | 'registrar';

export default function LoginScreen() {
  const [modo, setModo] = useState<Modo>('ingresar');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const autenticar = async () => {
    if (!supabase) {
      setMensaje('Falta configurar la clave publica de Supabase.');
      return;
    }

    if (!correo.trim() || contrasena.length < 6 || (modo === 'registrar' && !nombre.trim())) {
      setMensaje('Completa los datos. La contrasena debe tener al menos 6 caracteres.');
      return;
    }

    setCargando(true);
    setMensaje('');

    if (modo === 'registrar') {
      const { data, error } = await supabase.auth.signUp({
        email: correo.trim(),
        password: contrasena,
        options: { data: { nombre: nombre.trim() } },
      });

      setCargando(false);
      if (error) {
        setMensaje(error.message);
        return;
      }
      if (!data.session) {
        setMensaje('Revisa tu correo para confirmar la cuenta.');
        return;
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: correo.trim(),
        password: contrasena,
      });

      setCargando(false);
      if (error) {
        setMensaje('Correo o contrasena incorrectos.');
        return;
      }
    }

    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.pantalla}>
      <View style={styles.contenido}>
        <Text style={styles.titulo}>
          {modo === 'ingresar' ? 'Iniciar sesion' : 'Crear cuenta'}
        </Text>
        <Text style={styles.subtitulo}>Accede a AutoSport para continuar.</Text>

        {modo === 'registrar' ? (
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            value={nombre}
            onChangeText={setNombre}
          />
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Correo"
          keyboardType="email-address"
          autoCapitalize="none"
          value={correo}
          onChangeText={setCorreo}
        />
        <TextInput
          style={styles.input}
          placeholder="Contrasena"
          secureTextEntry
          value={contrasena}
          onChangeText={setContrasena}
        />

        {mensaje ? <Text style={styles.mensaje}>{mensaje}</Text> : null}

        <Pressable style={styles.boton} onPress={autenticar} disabled={cargando}>
          {cargando ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.botonTexto}>
              {modo === 'ingresar' ? 'Ingresar' : 'Registrarme'}
            </Text>
          )}
        </Pressable>

        <Pressable
          style={styles.cambiarModo}
          onPress={() => {
            setModo(modo === 'ingresar' ? 'registrar' : 'ingresar');
            setMensaje('');
          }}
        >
          <Text style={styles.cambiarModoTexto}>
            {modo === 'ingresar' ? 'Crear una cuenta' : 'Ya tengo una cuenta'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: { backgroundColor: '#eef2f6', flex: 1 },
  contenido: { flex: 1, justifyContent: 'center', padding: 24 },
  titulo: { color: '#121826', fontSize: 30, fontWeight: '900', textAlign: 'center' },
  subtitulo: { color: '#536173', marginBottom: 26, marginTop: 8, textAlign: 'center' },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
    borderRadius: 8,
    borderWidth: 1,
    color: '#121826',
    fontSize: 16,
    marginBottom: 14,
    padding: 14,
  },
  mensaje: { color: '#b91c1c', lineHeight: 20, marginBottom: 12, textAlign: 'center' },
  boton: { alignItems: 'center', backgroundColor: '#dc2626', borderRadius: 8, padding: 15 },
  botonTexto: { color: '#ffffff', fontSize: 16, fontWeight: '900' },
  cambiarModo: { alignItems: 'center', marginTop: 18, padding: 10 },
  cambiarModoTexto: { color: '#dc2626', fontWeight: '800' },
});
