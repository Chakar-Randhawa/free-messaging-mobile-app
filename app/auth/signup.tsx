import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function SignupScreen() {
  const router = useRouter(); const { register } = useAuth();
  const [displayName, setDisplayName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [busy, setBusy] = useState(false);
  async function submit() {
    if (displayName.trim().length < 2) return Alert.alert('Display name required', 'Use at least 2 characters.');
    if (!email.trim() || password.length < 6) return Alert.alert('Check your details', 'Use a valid email and a password with at least 6 characters.');
    try { setBusy(true); await register(email, password, displayName); router.replace('/home'); Alert.alert('Account created', 'A verification email has been sent.'); }
    catch (error) { Alert.alert('Unable to create account', friendlyError(error)); } finally { setBusy(false); }
  }
  return <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><View style={styles.card}>
    <Text style={styles.eyebrow}>GET STARTED</Text><Text style={styles.title}>Create account</Text><Text style={styles.subtitle}>Set up your free messaging account.</Text>
    <TextInput style={styles.input} placeholder="Display name" placeholderTextColor="#64748b" value={displayName} onChangeText={setDisplayName} maxLength={40} />
    <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#64748b" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
    <TextInput style={styles.input} placeholder="Password (6+ characters)" placeholderTextColor="#64748b" secureTextEntry value={password} onChangeText={setPassword} />
    <Pressable style={styles.primary} onPress={submit} disabled={busy}>{busy ? <ActivityIndicator color="#020817" /> : <Text style={styles.primaryText}>Create account</Text>}</Pressable>
    <Text style={styles.footer}>Already registered? <Link href="/auth/login" style={styles.link}>Sign in</Link></Text>
  </View></KeyboardAvoidingView>;
}
function friendlyError(error: unknown) { const message = error instanceof Error ? error.message : ''; if (message.includes('auth/email-already-in-use')) return 'An account already exists for this email.'; if (message.includes('auth/invalid-email')) return 'Enter a valid email address.'; return 'Please check your details and try again.'; }
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#020817', justifyContent: 'center', padding: 24 }, card: { gap: 14 }, eyebrow: { color: '#38bdf8', letterSpacing: 2, fontWeight: '700' }, title: { color: '#f8fafc', fontSize: 36, fontWeight: '800' }, subtitle: { color: '#94a3b8', fontSize: 16, marginBottom: 14 }, input: { backgroundColor: '#0f172a', borderColor: '#1e293b', borderWidth: 1, borderRadius: 12, padding: 16, color: '#f8fafc', fontSize: 16 }, primary: { backgroundColor: '#38bdf8', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 4 }, primaryText: { color: '#020817', fontWeight: '800', fontSize: 16 }, link: { color: '#38bdf8', fontWeight: '700' }, footer: { color: '#94a3b8', textAlign: 'center', marginTop: 12 } });
