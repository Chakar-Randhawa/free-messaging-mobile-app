import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!email.trim() || !password) return Alert.alert('Missing information', 'Enter your email and password.');
    try { setBusy(true); await login(email, password); router.replace('/home'); }
    catch (error) { Alert.alert('Unable to log in', friendlyError(error)); }
    finally { setBusy(false); }
  }

  return <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <View style={styles.card}>
      <Text style={styles.eyebrow}>WELCOME BACK</Text><Text style={styles.title}>Sign in</Text>
      <Text style={styles.subtitle}>Message your friends privately and in real time.</Text>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#64748b" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#64748b" secureTextEntry value={password} onChangeText={setPassword} />
      <Pressable style={styles.primary} onPress={submit} disabled={busy}>{busy ? <ActivityIndicator color="#020817" /> : <Text style={styles.primaryText}>Sign in</Text>}</Pressable>
      <Link href="/auth/forgot-password" style={styles.link}>Forgot password?</Link>
      <Text style={styles.footer}>New here? <Link href="/auth/signup" style={styles.link}>Create an account</Link></Text>
    </View>
  </KeyboardAvoidingView>;
}

function friendlyError(error: unknown) {
  const code = error instanceof Error ? error.message : '';
  if (code.includes('auth/invalid-credential')) return 'The email or password is incorrect.';
  if (code.includes('auth/too-many-requests')) return 'Too many attempts. Try again later.';
  return 'Please check your details and try again.';
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#020817', justifyContent: 'center', padding: 24 }, card: { gap: 14 }, eyebrow: { color: '#38bdf8', letterSpacing: 2, fontWeight: '700' }, title: { color: '#f8fafc', fontSize: 36, fontWeight: '800' }, subtitle: { color: '#94a3b8', fontSize: 16, lineHeight: 23, marginBottom: 14 }, input: { backgroundColor: '#0f172a', borderColor: '#1e293b', borderWidth: 1, borderRadius: 12, padding: 16, color: '#f8fafc', fontSize: 16 }, primary: { backgroundColor: '#38bdf8', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 4 }, primaryText: { color: '#020817', fontWeight: '800', fontSize: 16 }, link: { color: '#38bdf8', fontWeight: '700', textAlign: 'center' }, footer: { color: '#94a3b8', textAlign: 'center', marginTop: 12 } });
