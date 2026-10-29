import { Pressable, StyleSheet, Text } from 'react-native';
import { COLORS } from '../theme';

// Nút nhỏ dạng "chip", dùng để chọn loại giao dịch, category và bộ lọc.
export default function Chip({ label, selected, onPress, color = COLORS.primary }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && { backgroundColor: color, borderColor: color }]}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  label: {
    color: COLORS.text,
    fontSize: 14,
  },
  selectedLabel: {
    color: COLORS.white,
    fontWeight: '600',
  },
});
