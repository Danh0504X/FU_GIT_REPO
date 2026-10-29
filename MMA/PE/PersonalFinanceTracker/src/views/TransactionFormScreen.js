import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import AppButton from '../components/AppButton';
import Chip from '../components/Chip';
import { useAuth } from '../context/AuthContext';
import { getTransactionDetail, saveTransaction } from '../controllers/TransactionController';
import { COLORS } from '../theme';
import { getTodayString } from '../utils/format';

// Gợi ý category để nhập nhanh; người dùng vẫn có thể gõ category khác.
const CATEGORY_SUGGESTIONS = {
  income: ['Salary', 'Bonus', 'Investment', 'Gift'],
  expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health'],
};

function FormField({ label, error, children }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

// Dùng chung cho cả Add và Edit: có transactionId trong params nghĩa là đang Edit.
export default function TransactionFormScreen({ navigation, route }) {
  const { user } = useAuth();
  const transactionId = route.params?.transactionId ?? null;
  const [form, setForm] = useState(() => ({
    type: 'expense',
    amount: '',
    category: '',
    date: getTodayString(),
    note: '',
  }));
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(transactionId !== null);
  const [isSaving, setIsSaving] = useState(false);

  // Chế độ Edit: đọc giao dịch cũ từ database và điền sẵn vào form.
  useEffect(() => {
    if (transactionId === null) {
      return;
    }

    async function loadTransaction() {
      try {
        const transaction = await getTransactionDetail(user.id, transactionId);
        if (!transaction) {
          Alert.alert('Not found', 'This transaction no longer exists.');
          navigation.goBack();
          return;
        }
        setForm({
          type: transaction.type,
          amount: String(transaction.amount),
          category: transaction.category,
          date: transaction.date,
          note: transaction.note,
        });
      } catch {
        Alert.alert('Error', 'Could not load the transaction.');
        navigation.goBack();
      } finally {
        setIsLoading(false);
      }
    }
    loadTransaction();
  }, [user.id, transactionId, navigation]);

  function updateField(field, value) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  // Controller kiểm tra dữ liệu trước khi lưu; nếu không hợp lệ thì hiển thị lỗi dưới từng trường.
  async function handleSave() {
    setIsSaving(true);
    try {
      const result = await saveTransaction(user.id, form, transactionId);
      setErrors(result.errors);
      if (result.success) {
        navigation.goBack();
      }
    } catch {
      Alert.alert('Error', 'Could not save the transaction. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const saveTitle = transactionId === null ? 'Add Transaction' : 'Save Changes';

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
    >
      <FormField label="Type" error={errors.type}>
        <View style={styles.chipRow}>
          <Chip
            label="Income"
            color={COLORS.income}
            selected={form.type === 'income'}
            onPress={() => updateField('type', 'income')}
          />
          <Chip
            label="Expense"
            color={COLORS.expense}
            selected={form.type === 'expense'}
            onPress={() => updateField('type', 'expense')}
          />
        </View>
      </FormField>

      <FormField label="Amount" error={errors.amount}>
        <TextInput
          style={styles.input}
          placeholder="e.g. 50000"
          value={form.amount}
          onChangeText={(value) => updateField('amount', value)}
          keyboardType="decimal-pad"
        />
      </FormField>

      <FormField label="Category" error={errors.category}>
        <TextInput
          style={styles.input}
          placeholder="e.g. Food"
          value={form.category}
          onChangeText={(value) => updateField('category', value)}
        />
        <View style={[styles.chipRow, styles.wrap]}>
          {CATEGORY_SUGGESTIONS[form.type].map((category) => (
            <Chip
              key={category}
              label={category}
              selected={form.category === category}
              onPress={() => updateField('category', category)}
            />
          ))}
        </View>
      </FormField>

      <FormField label="Date (YYYY-MM-DD)" error={errors.date}>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={form.date}
          onChangeText={(value) => updateField('date', value)}
          maxLength={10}
        />
      </FormField>

      <FormField label="Note (optional)">
        <TextInput
          style={[styles.input, styles.noteInput]}
          placeholder="Add a note"
          value={form.note}
          onChangeText={(value) => updateField('note', value)}
          multiline
        />
      </FormField>

      <AppButton title={isSaving ? 'Saving...' : saveTitle} onPress={handleSave} disabled={isSaving} />
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
    paddingBottom: 40,
    gap: 18,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  noteInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  wrap: {
    flexWrap: 'wrap',
  },
  error: {
    color: COLORS.expense,
    fontSize: 13,
  },
});
