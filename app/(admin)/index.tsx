import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Administration() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Administration</Text>
        <Text style={styles.note}>
          Bunk, requirement, snack-day, inventory, and user management screens are built in their
          owning epics.
        </Text>
        <Link href="/sign-in" style={styles.link}>
          Sign Out (temporary)
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
  },
  note: {
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
  },
  link: {
    fontSize: 16,
    color: '#1a5fb4',
    paddingVertical: 8,
  },
});
