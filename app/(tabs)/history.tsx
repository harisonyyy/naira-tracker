import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Trash2, TrendingUp, TrendingDown, Inbox } from 'lucide-react-native';
import { Transaction, getTransactions, deleteTransaction, clearAllTransactions, formatNaira } from '@/lib/storage';
import { formatDate, formatTime } from '@/lib/totals';
import { AdBanner } from '@/components/AdBanner';

type FilterType = 'all' | 'income' | 'expense';

export default function HistoryScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');

  const loadData = useCallback(async () => {
    const txs = await getTransactions();
    setTransactions(txs);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const filtered = transactions.filter((t) => filter === 'all' || t.type === filter);

  const handleDelete = (id: string) => {
    Alert.alert('Delete transaction', 'Are you sure you want to delete this entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteTransaction(id);
          loadData();
        },
      },
    ]);
  };

  const handleClearAll = () => {
    if (transactions.length === 0) return;
    Alert.alert('Clear all', 'This will permanently delete all transactions. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear all',
        style: 'destructive',
        onPress: async () => {
          await clearAllTransactions();
          loadData();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} stickyHeaderIndices={[0]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>History</Text>
            <Text style={styles.subtitle}>{filtered.length} transaction{filtered.length !== 1 ? 's' : ''}</Text>
          </View>
          {transactions.length > 0 && (
            <TouchableOpacity onPress={handleClearAll} activeOpacity={0.7}>
              <Trash2 size={20} color="#dc2626" strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterRow}>
          {(['all', 'income', 'expense'] as FilterType[]).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Inbox size={48} color="#cbd5e1" strokeWidth={1.5} />
            <Text style={styles.emptyText}>No transactions found</Text>
            <Text style={styles.emptySubtext}>
              {filter === 'all' ? 'Start by adding your first entry' : `No ${filter} records yet`}
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {filtered.map((tx) => (
              <View key={tx.id} style={styles.transactionCard}>
                <View
                  style={[
                    styles.txIconWrap,
                    { backgroundColor: tx.type === 'income' ? '#dcfce7' : '#fee2e2' },
                  ]}
                >
                  {tx.type === 'income' ? (
                    <TrendingUp size={20} color="#16a34a" strokeWidth={2} />
                  ) : (
                    <TrendingDown size={20} color="#dc2626" strokeWidth={2} />
                  )}
                </View>
                <View style={styles.txInfo}>
                  <Text style={styles.txCategory}>{tx.category}</Text>
                  <Text style={styles.txNote}>{tx.note || 'No note'}</Text>
                  <Text style={styles.txDate}>
                    {formatDate(tx.date)} · {formatTime(tx.date)}
                  </Text>
                </View>
                <View style={styles.txRight}>
                  <Text
                    style={[
                      styles.txAmount,
                      { color: tx.type === 'income' ? '#16a34a' : '#dc2626' },
                    ]}
                  >
                    {tx.type === 'income' ? '+' : '-'}
                    {formatNaira(tx.amount)}
                  </Text>
                  <TouchableOpacity onPress={() => handleDelete(tx.id)} activeOpacity={0.6}>
                    <Trash2 size={16} color="#94a3b8" strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 16 }} />
      </ScrollView>
      <AdBanner />
    </View>
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
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    backgroundColor: '#f8fafc',
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
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterChipActive: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  filterChipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: '#334155',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#64748b',
  },
  emptySubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#94a3b8',
  },
  listContainer: {
    gap: 10,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  txIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txInfo: {
    flex: 1,
  },
  txCategory: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: '#0f172a',
  },
  txNote: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  txDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
  },
  txRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  txAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
  },
});
