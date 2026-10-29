import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import AppButton from '../components/AppButton';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../theme';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Đăng nhập thành công thì AppNavigator tự chuyển sang màn hình chính,
  // nên ở đây chỉ cần xử lý trường hợp thất bại.
  async function handleLogin() {
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      const result = await signIn(username, password);
      if (!result.success) {
        setErrorMessage(result.message);
      }
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Personal Finance</Text>
        <Text style={styles.subtitle}>Sign in to manage your income and expenses</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          onSubmitEditing={handleLogin}
        />

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

        <AppButton
          title={isSubmitting ? 'Signing in...' : 'Sign In'}
          onPress={handleLogin}
          disabled={isSubmitting}
        />

        <Text style={styles.hint}>Demo accounts: alice / alice123 · bob / bob123</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: COLORS.background,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
    gap: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  error: {
    color: COLORS.expense,
    textAlign: 'center',
  },
  hint: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
