import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowDownCircle, ArrowUpCircle, Check } from 'lucide-react-native';
import {
  TransactionType,
  getCategories,
  addTransaction,
  formatNaira,
} from '@/lib/storage';

export default function AddScreen() {
  const router = useRouter();
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const categories = getCategories(type);

  useEffect(() => {
    setCategory('');
  }, [type]);

  const handleSave = async () => {
    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid amount.');
      return;
    }
    if (!category) {
      Alert.alert('Select category', 'Please choose a category.');
      return;
    }

    setSaving(true);
    try {
      await addTransaction({
        type,
        amount: parsedAmount,
        category,
        note: note.trim(),
        date: new Date().toISOString(),
      });
      setAmount('');
      setNote('');
      setCategory('');
      router.navigate('/');
    } catch {
      Alert.alert('Error', 'Could not save transaction. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Add Transaction</Text>
        <Text style={styles.subtitle}>Record your income or expense</Text>

        <View style={styles.typeToggle}>
          <TouchableOpacity
            style={[styles.typeButton, type === 'expense' && styles.typeButtonActiveExpense]}
            onPress={() => setType('expense')}
            activeOpacity={0.8}
          >
            <ArrowDownCircle size={20} color={type === 'expense' ? '#ffffff' : '#dc2626'} strokeWidth={2} />
            <Text
              style={[
                styles.typeButtonText,
                type === 'expense' && styles.typeButtonTextActive,
              ]}
            >
              Expense
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === 'income' && styles.typeButtonActiveIncome]}
            onPress={() => setType('income')}
            activeOpacity={0.8}
          >
            <ArrowUpCircle size={20} color={type === 'income' ? '#ffffff' : '#16a34a'} strokeWidth={2} />
            <Text
              style={[
                styles.typeButtonText,
                type === 'income' && styles.typeButtonTextActive,
              ]}
            >
              Income
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Amount (₦)</Text>
        <View style={styles.amountInputWrap}>
          <Text style={styles.nairaSymbol}>₦</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            placeholderTextColor="#cbd5e1"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={(text) => setAmount(text.replace(/[^0-9.]/g, ''))}
          />
        </View>
        {amount ? (
          <Text style={styles.amountPreview}>{formatNaira(parseFloat(amount) || 0)}</Text>
        ) : null}

        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryGrid}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                category === cat && styles.categoryChipActive,
              ]}
              onPress={() => setCategory(cat)}
              activeOpacity={0.7}
            >
              {category === cat && <Check size={14} color="#ffffff" strokeWidth={2.5} />}
              <Text
                style={[
                  styles.categoryChipText,
                  category === cat && styles.categoryChipTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Note (optional)</Text>
        <TextInput
          style={styles.noteInput}
          placeholder="Add a note..."
          placeholderTextColor="#cbd5e1"
          value={note}
          onChangeText={setNote}
          maxLength={100}
        />

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save Transaction'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
    paddingTop: 56,
    paddingBottom: 40,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#0f172a',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 24,
  },
  typeToggle: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  typeButtonActiveExpense: {
    borderColor: '#dc2626',
    backgroundColor: '#dc2626',
  },
  typeButtonActiveIncome: {
    borderColor: '#16a34a',
    backgroundColor: '#16a34a',
  },
  typeButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: '#334155',
  },
  typeButtonTextActive: {
    color: '#ffffff',
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#334155',
    marginBottom: 8,
  },
  amountInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 4,
  },
  nairaSymbol: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#16a34a',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#0f172a',
    paddingVertical: 16,
  },
  amountPreview: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#64748b',
    marginBottom: 20,
    marginLeft: 4,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  categoryChipActive: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  categoryChipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: '#334155',
  },
  categoryChipTextActive: {
    color: '#ffffff',
  },
  noteInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#0f172a',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 28,
  },
  saveButton: {
    backgroundColor: '#16a34a',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#ffffff',
  },
});
