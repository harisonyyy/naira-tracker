import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@expense_tracker_transactions';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  note: string;
  date: string;
}

const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Health',
  'Education',
  'Entertainment',
  'Salary',
  'Business',
  'Gift',
  'Other',
];

export function getCategories(type: TransactionType): string[] {
  if (type === 'income') {
    return ['Salary', 'Business', 'Gift', 'Other'];
  }
  return ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Education', 'Entertainment', 'Other'];
}

export async function getTransactions(): Promise<Transaction[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data) as Transaction[];
      return parsed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return [];
  } catch {
    return [];
  }
}

export async function addTransaction(tx: Omit<Transaction, 'id'>): Promise<void> {
  const existing = await getTransactions();
  const newTx: Transaction = { ...tx, id: Date.now().toString() + Math.random().toString(36).slice(2, 8) };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, newTx]));
}

export async function deleteTransaction(id: string): Promise<void> {
  const existing = await getTransactions();
  const filtered = existing.filter((t) => t.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export async function clearAllTransactions(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export function formatNaira(amount: number): string {
  return '₦' + amount.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}
