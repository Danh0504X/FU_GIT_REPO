import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import { useAuth } from '../context/AuthContext';
import { getSummary } from '../controllers/TransactionController';
import { COLORS } from '../theme';
import { formatMoney } from '../utils/format';

export default function HomeScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const [summary, setSummary] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Tải lại số liệu mỗi khi màn hình được hiển thị (kể cả khi quay lại từ
  // màn hình thêm/sửa/xóa), nhờ đó Dashboard luôn khớp với dữ liệu mới nhất.
  useFocusEffect(
    useCallback(() => {
      async function loadSummary() {
        try {
          setSummary(await getSummary(user.id));
          setErrorMessage('');
        } catch {
          setErrorMessage('Could not load your summary. Please try again.');
        }
      }
      loadSummary();
    }, [user.id])
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.username}>{user.username}</Text>
        </View>
        <AppButton title="Log out" color={COLORS.expense} outline onPress={signOut} />
      </View>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      {summary === null && !errorMessage ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : null}

      {summary !== null ? (
        <>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <Text style={styles.balanceValue}>{formatMoney(summary.balance)}</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.smallCard}>
              <Text style={styles.cardLabel}>Total Income</Text>
              <Text style={[styles.cardValue, { color: COLORS.income }]}>
                {formatMoney(summary.totalIncome)}
              </Text>
            </View>
            <View style={styles.smallCard}>
              <Text style={styles.cardLabel}>Total Expenses</Text>
              <Text style={[styles.cardValue, { color: COLORS.expense }]}>
                {formatMoney(summary.totalExpense)}
              </Text>
            </View>
          </View>
        </>
      ) : null}

      <AppButton title="+ Add Transaction" onPress={() => navigation.navigate('TransactionForm')} />
      <AppButton
        title="View All Transactions"
        outline
        onPress={() => navigation.navigate('Transactions')}
      />
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
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  username: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
  },
  error: {
    color: COLORS.expense,
  },
  balanceCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 24,
  },
  balanceLabel: {
    color: COLORS.white,
    opacity: 0.85,
    fontSize: 14,
  },
  balanceValue: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: '700',
    marginTop: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  smallCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
  },
  cardLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 6,
  },
});
