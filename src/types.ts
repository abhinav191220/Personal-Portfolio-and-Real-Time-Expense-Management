export type TransactionType = 'INCOME' | 'EXPENSE' | 'ASSET_BUY' | 'ASSET_SELL';

export type ExpenseCategory = 
  | 'Rent & Housing'
  | 'Groceries & Dining'
  | 'Tuition & Books'
  | 'Transportation'
  | 'Entertainment'
  | 'Utilities & Subscriptions'
  | 'Investment Deposit'
  | 'Other';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: ExpenseCategory | string;
  amount: number;
  date: string;
  description: string;
  account: 'Checking' | 'Savings' | 'Brokerage Cash' | 'Crypto Wallet';
}

export interface AssetHolding {
  id: string;
  symbol: string;
  name: string;
  type: 'STOCK' | 'CRYPTO';
  shares: number;
  averageBuyPrice: number;
  currentPrice: number;
  change24h: number;
}

export interface BudgetLimit {
  category: ExpenseCategory;
  monthlyLimit: number;
  currentSpent: number;
}

export interface JavaClassDoc {
  name: string;
  package: string;
  layer: string;
  description: string;
  methods: string[];
  snippet: string;
}

export interface UnitTestResult {
  suite: string;
  testName: string;
  durationMs: number;
  status: 'PASSED' | 'FAILED';
  details: string;
}
