import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import { useAuth } from '../context/AuthContext';
import { deleteTransaction, getTransactionDetail } from '../controllers/TransactionController';
import { COLORS } from '../theme';
import { formatMoney } from '../utils/format';

function DetailRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function TransactionDetailScreen({ navigation, route }) {
  const { user } = useAuth();
  const { transactionId } = route.params;
  const [transaction, setTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Tải lại mỗi khi màn hình được hiển thị để thấy ngay thay đổi sau khi Edit.
  useFocusEffect(
    useCallback(() => {
      async function loadTransaction() {
        try {
          const data = await getTransactionDetail(user.id, transactionId);
          setTransaction(data);
          setErrorMessage(data ? '' : 'Transaction not found.');
        } catch {
          setErrorMessage('Could not load the transaction. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
      loadTransaction();
    }, [user.id, transactionId])
  );

  async function handleDelete() {
    try {
      await deleteTransaction(user.id, transactionId);
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Could not delete the transaction. Please try again.');
    }
  }

  // Hỏi xác nhận trước; chỉ xóa khi người dùng chọn "Delete".
  function confirmDelete() {
    Alert.alert('Delete transaction', 'Are you sure you want to delete this transaction?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: handleDelete },
    ]);
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!transaction) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{errorMessage}</Text>
      </View>
    );
  }

  const isIncome = transaction.type === 'income';
  const typeColor = isIncome ? COLORS.income : COLORS.expense;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={[styles.badge, { backgroundColor: typeColor }]}>
          {isIncome ? 'Income' : 'Expense'}
        </Text>
        <Text style={[styles.amount, { color: typeColor }]}>
          {isIncome ? '+' : '-'}
          {formatMoney(transaction.amount)}
        </Text>

        <DetailRow label="Transaction ID" value={`#${transaction.id}`} />
        <DetailRow label="Category" value={transaction.category} />
        <DetailRow label="Date" value={transaction.date} />
        <DetailRow label="Note" value={transaction.note || '—'} />
      </View>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <AppButton
        title="Edit"
        onPress={() => navigation.navigate('TransactionForm', { transactionId: transaction.id })}
      />
      <AppButton title="Delete" color={COLORS.expense} outline onPress={confirmDelete} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    gap: 14,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: COLORS.background,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 6,
  },
  badge: {
    alignSelf: 'flex-start',
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 13,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  amount: {
    fontSize: 30,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  rowLabel: {
    color: COLORS.textMuted,
    fontSize: 15,
  },
  rowValue: {
    flex: 1,
    textAlign: 'right',
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '500',
  },
  error: {
    color: COLORS.expense,
    textAlign: 'center',
  },
});
