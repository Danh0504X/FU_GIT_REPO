import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Chip from '../components/Chip';
import TransactionItem from '../components/TransactionItem';
import { useAuth } from '../context/AuthContext';
import { getCategories, getTransactionList } from '../controllers/TransactionController';
import { COLORS } from '../theme';

const TYPE_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Income', value: 'income' },
  { label: 'Expense', value: 'expense' },
];

export default function TransactionListScreen({ navigation }) {
  const { user } = useAuth();
  const [keyword, setKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Truy vấn lại SQLite mỗi khi màn hình được hiển thị hoặc khi từ khóa/bộ lọc thay đổi.
  // isActive dùng để bỏ qua kết quả của lần truy vấn cũ khi người dùng đã gõ tiếp,
  // tránh trường hợp kết quả cũ trả về muộn và ghi đè kết quả mới.
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadTransactions() {
        try {
          const [transactionList, categoryList] = await Promise.all([
            getTransactionList(user.id, { keyword, type: typeFilter, category: categoryFilter }),
            getCategories(user.id),
          ]);
          if (!isActive) {
            return;
          }
          setTransactions(transactionList);
          setCategories(categoryList);
          setErrorMessage('');
          // Category đang lọc không còn giao dịch nào (vừa bị sửa/xóa) thì bỏ lọc category.
          if (categoryFilter && !categoryList.includes(categoryFilter)) {
            setCategoryFilter('');
          }
        } catch {
          if (isActive) {
            setErrorMessage('Could not load transactions. Please try again.');
          }
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      }

      loadTransactions();
      return () => {
        isActive = false;
      };
    }, [user.id, keyword, typeFilter, categoryFilter])
  );

  const hasFilters = keyword.trim() !== '' || typeFilter !== 'all' || categoryFilter !== '';
  const emptyText = hasFilters
    ? 'No transactions match your search or filters.'
    : 'No transactions yet. Tap + to add your first one.';

  return (
    <View style={styles.screen}>
      <View style={styles.filters}>
        <TextInput
          style={styles.search}
          placeholder="Search by note or category"
          value={keyword}
          onChangeText={setKeyword}
          autoCorrect={false}
        />

        <View style={styles.chipRow}>
          {TYPE_FILTERS.map((filter) => (
            <Chip
              key={filter.value}
              label={filter.label}
              selected={typeFilter === filter.value}
              onPress={() => setTypeFilter(filter.value)}
            />
          ))}
        </View>

        {categories.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            <Chip
              label="All categories"
              selected={categoryFilter === ''}
              onPress={() => setCategoryFilter('')}
            />
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                selected={categoryFilter === category}
                onPress={() => setCategoryFilter(category)}
              />
            ))}
          </ScrollView>
        ) : null}
      </View>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      {isLoading ? (
        <ActivityIndicator style={styles.loading} size="large" color={COLORS.primary} />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TransactionItem
              transaction={item}
              onPress={() => navigation.navigate('TransactionDetail', { transactionId: item.id })}
            />
          )}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={errorMessage ? null : <Text style={styles.empty}>{emptyText}</Text>}
        />
      )}

      <Pressable
        style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
        onPress={() => navigation.navigate('TransactionForm')}
      >
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  filters: {
    padding: 16,
    paddingBottom: 8,
    gap: 10,
  },
  search: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.text,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  error: {
    color: COLORS.expense,
    paddingHorizontal: 16,
  },
  loading: {
    marginTop: 32,
  },
  list: {
    padding: 16,
    paddingBottom: 96,
    gap: 10,
  },
  empty: {
    textAlign: 'center',
    color: COLORS.textMuted,
    marginTop: 32,
    fontSize: 15,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  pressed: {
    opacity: 0.8,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 30,
    lineHeight: 32,
  },
});
