import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>PHASE 1</Text>
          <Text style={styles.title}>Free Messaging Mobile App</Text>
          <Text style={styles.subtitle}>
            Expo + React Native foundation for Android and iOS messaging.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Planned Stack</Text>
          <Text style={styles.listItem}>• Expo + React Native</Text>
          <Text style={styles.listItem}>• TypeScript</Text>
          <Text style={styles.listItem}>• Firebase Authentication</Text>
          <Text style={styles.listItem}>• Firestore real-time messaging</Text>
          <Text style={styles.listItem}>• No Firebase Storage for media</Text>
          <Text style={styles.listItem}>• Free media strategy layer</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Up</Text>
          <Text style={styles.listItem}>• Firebase setup</Text>
          <Text style={styles.listItem}>• Auth screens</Text>
          <Text style={styles.listItem}>• Display name onboarding</Text>
          <Text style={styles.listItem}>• Conversation list</Text>
          <Text style={styles.listItem}>• Real-time chat</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#020817',
  },
  container: {
    padding: 24,
    gap: 20,
  },
  heroCard: {
    borderRadius: 20,
    padding: 24,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 2,
    color: '#38bdf8',
    marginBottom: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#cbd5e1',
    lineHeight: 24,
  },
  section: {
    backgroundColor: '#0f172a',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 12,
  },
  listItem: {
    fontSize: 15,
    color: '#cbd5e1',
    lineHeight: 28,
  },
});
