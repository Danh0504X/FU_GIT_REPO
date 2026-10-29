import { Pressable, StyleSheet, Text } from 'react-native';
import { COLORS } from '../theme';

// Nút bấm dùng chung. outline = true: nền trắng, chữ và viền theo màu truyền vào.
export default function AppButton({ title, onPress, color = COLORS.primary, outline = false, disabled = false }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { borderColor: color, backgroundColor: outline ? COLORS.card : color },
        (pressed || disabled) && styles.dimmed,
      ]}
    >
      <Text style={[styles.title, { color: outline ? color : COLORS.white }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  dimmed: {
    opacity: 0.6,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
});
