import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AuthProvider, useAuth } from '@/context/AuthContext';

function RootNavigator() {
  const { user, loading } = useAuth();
  if (loading) {
    return <View style={styles.loading}><ActivityIndicator size="large" color="#38bdf8" /></View>;
  }
  if (!user) return <Redirect href="/auth/login" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return <AuthProvider><RootNavigator /></AuthProvider>;
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#020817' },
});
