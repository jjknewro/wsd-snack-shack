import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, spacing, typography } from '@/theme';

export default function SignIn() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.appName}>WSD Snack Shack</Text>
        <ScreenHeader title="Sign In" />
        <Text style={styles.note}>
          Real sign-in is implemented in EPIC 3. The buttons below are a temporary way to reach the
          staff and administrator areas until then.
        </Text>
        <AppButton
          label="Continue as Staff (temporary)"
          onPress={() => router.push('/(staff)/today')}
        />
        <AppButton
          label="Continue as Administrator (temporary)"
          onPress={() => router.push('/(admin)')}
          variant="secondary"
        />
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
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  appName: {
    ...typography.appName,
    color: colors.text,
  },
  note: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
