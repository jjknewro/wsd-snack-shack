import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignIn() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.appName}>WSD Snack Shack</Text>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.note}>
          Real sign-in is implemented in EPIC 3. The links below are a temporary way to reach the
          staff and administrator areas until then.
        </Text>
        <Link href="/(staff)/today" style={styles.link}>
          Continue as Staff (temporary)
        </Link>
        <Link href="/(admin)" style={styles.link}>
          Continue as Administrator (temporary)
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
  appName: {
    fontSize: 28,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
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
