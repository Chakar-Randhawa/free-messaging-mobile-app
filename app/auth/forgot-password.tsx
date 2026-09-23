import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function ForgotPasswordScreen() {
  const { reset } = useAuth(); const [email, setEmail] = useState(''); const [busy, setBusy] = useState(false);
  async function submit() { if (!email.trim()) return Alert.alert('Email required', 'Enter the email for your account.'); try { setBusy(true); await reset(email); Alert.alert('Check your inbox', 'If an account exists, a password reset link has been sent.'); } catch { Alert.alert('Unable to send reset email', 'Check the email and try again.'); } finally { setBusy(false); } }
  return <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><View style={styles.card}><Text style={styles.title}>Reset password</Text><Text style={styles.subtitle}>We will send instructions to your email.</Text><TextInput style={styles.input} placeholder="Email" placeholderTextColor="#64748b" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} /><Pressable style={styles.primary} onPress={submit} disabled={busy}><Text style={styles.primaryText}>{busy ? 'Sending…' : 'Send reset link'}</Text></Pressable><Link href="/auth/login" style={styles.link}>Back to sign in</Link></View></KeyboardAvoidingView>;
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#020817', justifyContent: 'center', padding: 24 }, card: { gap: 16 }, title: { color: '#f8fafc', fontSize: 32, fontWeight: '800' }, subtitle: { color: '#94a3b8', fontSize: 16 }, input: { backgroundColor: '#0f172a', borderColor: '#1e293b', borderWidth: 1, borderRadius: 12, padding: 16, color: '#f8fafc', fontSize: 16 }, primary: { backgroundColor: '#38bdf8', borderRadius: 12, padding: 16, alignItems: 'center' }, primaryText: { color: '#020817', fontWeight: '800', fontSize: 16 }, link: { color: '#38bdf8', fontWeight: '700', textAlign: 'center' } });
