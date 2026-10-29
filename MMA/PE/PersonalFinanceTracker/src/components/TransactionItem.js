import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../theme';
import { formatMoney } from '../utils/format';

// Một dòng trong danh sách giao dịch: khoản thu màu xanh (+), khoản chi màu đỏ (-).
export default function TransactionItem({ transaction, onPress }) {
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? COLORS.income : COLORS.expense;
  const subtitle = transaction.note ? `${transaction.date} · ${transaction.note}` : transaction.date;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={[styles.indicator, { backgroundColor: amountColor }]} />
      <View style={styles.info}>
        <Text style={styles.category} numberOfLines={1}>
          {transaction.category}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      <Text style={[styles.amount, { color: amountColor }]}>
        {isIncome ? '+' : '-'}
        {formatMoney(transaction.amount)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  indicator: {
    width: 6,
    alignSelf: 'stretch',
    borderRadius: 3,
  },
  info: {
    flex: 1,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
});
