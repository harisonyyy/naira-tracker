import { Transaction, formatNaira } from './storage';

export interface Totals {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  todayIncome: number;
  todayExpense: number;
  weekIncome: number;
  weekExpense: number;
}

function isSameDay(date: Date, compare: Date): boolean {
  return (
    date.getFullYear() === compare.getFullYear() &&
    date.getMonth() === compare.getMonth() &&
    date.getDate() === compare.getDate()
  );
}

function isThisWeek(date: Date, now: Date): boolean {
  const dayOfWeek = now.getDay();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - dayOfWeek);
  weekStart.setHours(0, 0, 0, 0);
  return date >= weekStart;
}

export function calculateTotals(transactions: Transaction[]): Totals {
  const now = new Date();
  let balance = 0;
  let totalIncome = 0;
  let totalExpense = 0;
  let todayIncome = 0;
  let todayExpense = 0;
  let weekIncome = 0;
  let weekExpense = 0;

  for (const tx of transactions) {
    const txDate = new Date(tx.date);
    if (tx.type === 'income') {
      balance += tx.amount;
      totalIncome += tx.amount;
      if (isSameDay(txDate, now)) todayIncome += tx.amount;
      if (isThisWeek(txDate, now)) weekIncome += tx.amount;
    } else {
      balance -= tx.amount;
      totalExpense += tx.amount;
      if (isSameDay(txDate, now)) todayExpense += tx.amount;
      if (isThisWeek(txDate, now)) weekExpense += tx.amount;
    }
  }

  return { balance, totalIncome, totalExpense, todayIncome, todayExpense, weekIncome, weekExpense };
}

export function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatTime(date: string): string {
  const d = new Date(date);
  return d.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
}

export { formatNaira };
