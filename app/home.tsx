import { Redirect } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  if (!user) return <Redirect href="/auth/login" />;
  return <View style={styles.screen}><Text style={styles.eyebrow}>FREE MESSAGING</Text><Text style={styles.title}>Welcome, {user.displayName || 'there'}.</Text><Text style={styles.subtitle}>Your conversations will appear here in the next phase.</Text><Pressable style={styles.button} onPress={logout}><Text style={styles.buttonText}>Sign out</Text></Pressable></View>;
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#020817', padding: 24, paddingTop: 80 }, eyebrow: { color: '#38bdf8', letterSpacing: 2, fontWeight: '700' }, title: { color: '#f8fafc', fontSize: 30, fontWeight: '800', marginTop: 10 }, subtitle: { color: '#94a3b8', fontSize: 16, lineHeight: 24, marginTop: 12 }, button: { backgroundColor: '#1e293b', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 32 }, buttonText: { color: '#f8fafc', fontWeight: '700' } });
