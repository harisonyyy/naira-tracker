import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { TrendingUp, TrendingDown, Wallet, CalendarDays, CalendarRange } from 'lucide-react-native';
import { Transaction, getTransactions, formatNaira } from '@/lib/storage';
import { calculateTotals, Totals } from '@/lib/totals';
import { AdBanner } from '@/components/AdBanner';

export default function HomeScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totals, setTotals] = useState<Totals>({
    balance: 0,
    totalIncome: 0,
    totalExpense: 0,
    todayIncome: 0,
    todayExpense: 0,
    weekIncome: 0,
    weekExpense: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const txs = await getTransactions();
    setTransactions(txs);
    setTotals(calculateTotals(txs));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#16a34a']} />}
    >
      <Text style={styles.headerTitle}>My Wallet</Text>
      <Text style={styles.headerSubtitle}>Track your money in Naira</Text>

      <View style={styles.balanceCard}>
        <View style={styles.balanceIconRow}>
          <Wallet size={22} color="#ffffff" strokeWidth={2} />
          <Text style={styles.balanceLabel}>Current Balance</Text>
        </View>
        <Text style={styles.balanceAmount}>{formatNaira(totals.balance)}</Text>
        <View style={styles.balanceRow}>
          <View style={styles.balanceItem}>
            <TrendingUp size={16} color="#bbf7d0" strokeWidth={2} />
            <Text style={styles.balanceItemText}>{formatNaira(totals.totalIncome)}</Text>
          </View>
          <View style={styles.balanceItem}>
            <TrendingDown size={16} color="#fecaca" strokeWidth={2} />
            <Text style={styles.balanceItemTextExpense}>{formatNaira(totals.totalExpense)}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Today</Text>
      <View style={styles.periodCard}>
        <View style={styles.periodRow}>
          <View style={[styles.periodIconWrap, { backgroundColor: '#dcfce7' }]}>
            <TrendingUp size={18} color="#16a34a" strokeWidth={2} />
          </View>
          <Text style={styles.periodLabel}>Income</Text>
          <Text style={styles.periodValueIncome}>{formatNaira(totals.todayIncome)}</Text>
        </View>
        <View style={styles.periodDivider} />
        <View style={styles.periodRow}>
          <View style={[styles.periodIconWrap, { backgroundColor: '#fee2e2' }]}>
            <TrendingDown size={18} color="#dc2626" strokeWidth={2} />
          </View>
          <Text style={styles.periodLabel}>Expense</Text>
          <Text style={styles.periodValueExpense}>{formatNaira(totals.todayExpense)}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>This Week</Text>
      <View style={styles.periodCard}>
        <View style={styles.periodRow}>
          <View style={[styles.periodIconWrap, { backgroundColor: '#dcfce7' }]}>
            <CalendarRange size={18} color="#16a34a" strokeWidth={2} />
          </View>
          <Text style={styles.periodLabel}>Income</Text>
          <Text style={styles.periodValueIncome}>{formatNaira(totals.weekIncome)}</Text>
        </View>
        <View style={styles.periodDivider} />
        <View style={styles.periodRow}>
          <View style={[styles.periodIconWrap, { backgroundColor: '#fee2e2' }]}>
            <CalendarDays size={18} color="#dc2626" strokeWidth={2} />
          </View>
          <Text style={styles.periodLabel}>Expense</Text>
          <Text style={styles.periodValueExpense}>{formatNaira(totals.weekExpense)}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Recent Activity</Text>
      {transactions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No transactions yet</Text>
          <Text style={styles.emptySubtext}>Tap the Add tab to record your first entry</Text>
        </View>
      ) : (
        <View style={styles.recentList}>
          {transactions.slice(0, 5).map((tx) => (
            <View key={tx.id} style={styles.recentItem}>
              <View
                style={[
                  styles.recentDot,
                  { backgroundColor: tx.type === 'income' ? '#16a34a' : '#dc2626' },
                ]}
              />
              <View style={styles.recentInfo}>
                <Text style={styles.recentCategory}>{tx.category}</Text>
                <Text style={styles.recentNote}>{tx.note || 'No note'}</Text>
              </View>
              <Text
                style={[
                  styles.recentAmount,
                  { color: tx.type === 'income' ? '#16a34a' : '#dc2626' },
                ]}
              >
                {tx.type === 'income' ? '+' : '-'}
                {formatNaira(tx.amount)}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={{ height: 16 }} />
      <AdBanner />
    </ScrollView>
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
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#0f172a',
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 20,
  },
  balanceCard: {
    backgroundColor: '#16a34a',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  balanceIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  balanceLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#d1fae5',
  },
  balanceAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: '#ffffff',
    marginBottom: 16,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  balanceItemText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#d1fae5',
  },
  balanceItemTextExpense: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#fecaca',
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#0f172a',
    marginBottom: 12,
  },
  periodCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  periodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  periodIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: '#334155',
    flex: 1,
  },
  periodValueIncome: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#16a34a',
  },
  periodValueExpense: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#dc2626',
  },
  periodDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 14,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#ffffff',
    borderRadius: 16,
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
    marginTop: 4,
  },
  recentList: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 12,
  },
  recentDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  recentInfo: {
    flex: 1,
  },
  recentCategory: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: '#0f172a',
  },
  recentNote: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  recentAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
  },
});
