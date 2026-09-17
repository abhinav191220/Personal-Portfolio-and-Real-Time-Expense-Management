import { useState, useMemo } from 'react';
import { 
  PlusCircle, 
  Trash2, 
  Edit3, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  IndianRupee, 
  Wallet, 
  PieChart as PieIcon, 
  LineChart as LineIcon, 
  RefreshCw, 
  Search, 
  Database, 
  FileDown, 
  CheckCircle,
  Clock,
  Sparkles,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  X
} from 'lucide-react';
import { Transaction, AssetHolding, BudgetLimit, ExpenseCategory, TransactionType } from '../types';
import { INITIAL_TRANSACTIONS, INITIAL_ASSETS, INITIAL_BUDGETS } from '../data/initialData';

export const DashboardView: React.FC = () => {
  // State
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [assets, setAssets] = useState<AssetHolding[]>(INITIAL_ASSETS);
  const [budgets] = useState<BudgetLimit[]>(INITIAL_BUDGETS);

  // Form State
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [category, setCategory] = useState<ExpenseCategory>('Groceries & Dining');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>('2026-09-17');
  const [description, setDescription] = useState<string>('');
  const [account, setAccount] = useState<'Checking' | 'Savings' | 'Brokerage Cash' | 'Crypto Wallet'>('Checking');
  
  // Validation errors
  const [validationError, setValidationError] = useState<string | null>(null);
  const [validationSuccess, setValidationSuccess] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Live Market Pipeline simulation state
  const [isFetchingAsync, setIsFetchingAsync] = useState<boolean>(false);
  const [lastFetchTime, setLastFetchTime] = useState<string>('06:07:39 AM');
  const [showJacksonJson, setShowJacksonJson] = useState<boolean>(false);
  const [activeJsonPayload, setActiveJsonPayload] = useState<string>('');

  // Report Modal
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  // SQLite Inspector Modal
  const [showSqlInspector, setShowSqlInspector] = useState<boolean>(false);
  const [lastExecutedSql, setLastExecutedSql] = useState<string>(
    'SELECT * FROM transactions ORDER BY date DESC LIMIT 20;'
  );

  // Calculations
  const metrics = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
      if (t.type === 'INCOME') totalIncome += t.amount;
      if (t.type === 'EXPENSE') totalExpense += t.amount;
    });

    const portfolioValue = assets.reduce((sum, a) => sum + (a.shares * a.currentPrice), 0);
    const portfolioCost = assets.reduce((sum, a) => sum + (a.shares * a.averageBuyPrice), 0);
    const unrealizedGain = portfolioValue - portfolioCost;
    const unrealizedGainPercent = portfolioCost > 0 ? (unrealizedGain / portfolioCost) * 100 : 0;

    // Liquid cash
    const liquidCash = 45000.00 + totalIncome - totalExpense;
    const netWorth = liquidCash + portfolioValue;

    return {
      netWorth,
      liquidCash,
      totalIncome,
      totalExpense,
      portfolioValue,
      unrealizedGain,
      unrealizedGainPercent,
      savingsRate: totalIncome > 0 ? Math.max(0, ((totalIncome - totalExpense) / totalIncome) * 100) : 0
    };
  }, [transactions, assets]);

  // Dynamic Category breakdown for Pie Chart
  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'EXPENSE')
      .forEach(t => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });

    const total = Object.values(map).reduce((a, b) => a + b, 0) || 1;
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1', '#64748b'];

    return Object.entries(map).map(([cat, val], idx) => ({
      category: cat,
      amount: val,
      percentage: ((val / total) * 100).toFixed(1),
      color: colors[idx % colors.length]
    }));
  }, [transactions]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = categoryFilter === 'ALL' || t.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [transactions, searchQuery, categoryFilter]);

  // Handle Form Submission with Strict Java Validation Simulation
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setValidationSuccess(null);

    const parsedAmount = parseFloat(amount);

    // Validation 1: Empty or Non-numeric
    if (isNaN(parsedAmount)) {
      setValidationError('[TransactionValidationException]: Amount cannot be empty and must be a valid numeric currency value.');
      return;
    }

    // Validation 2: Negative or Zero
    if (parsedAmount <= 0) {
      setValidationError('[TransactionValidationException]: Amount must be strictly greater than ₹0.00. Negative values violate SQLite constraints.');
      return;
    }

    // Validation 3: Date empty or malformed
    if (!date) {
      setValidationError('[DateTimeParseException]: Transaction date must be a valid ISO-8601 string.');
      return;
    }

    // Validation 4: Description check
    if (!description.trim()) {
      setValidationError('[TransactionValidationException]: Transaction note/description cannot be blank.');
      return;
    }

    const newTxn: Transaction = {
      id: `TXN-${Math.floor(100 + Math.random() * 900)}`,
      type,
      category,
      amount: parsedAmount,
      date,
      description: description.trim(),
      account
    };

    setTransactions(prev => [newTxn, ...prev]);
    setLastExecutedSql(
      `-- JDBC PreparedStatement (Atomic Insert)\nINSERT INTO transactions (id, type, category, amount, date, description, account) \nVALUES ('${newTxn.id}', '${newTxn.type}', '${newTxn.category}', ${newTxn.amount.toFixed(2)}, '${newTxn.date}', '${newTxn.description.replace(/'/g, "''")}', '${newTxn.account}');`
    );

    setValidationSuccess(`Transaction ${newTxn.id} persisted to local SQLite database via JDBC.`);
    setAmount('');
    setDescription('');
    setTimeout(() => setValidationSuccess(null), 3500);
  };

  const handleDelete = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    setLastExecutedSql(`-- JDBC PreparedStatement\nDELETE FROM transactions WHERE id = '${id}';`);
  };

  // Simulate CompletableFuture Async Market Fetch
  const simulateAsyncMarketTick = () => {
    setIsFetchingAsync(true);
    setLastExecutedSql('-- Background CompletableFuture execution: Polling live quotes without blocking UI');

    setTimeout(() => {
      // randomly adjust prices slightly (±0.5% to ±2%)
      setAssets(prev => {
        return prev.map(a => {
          const deltaPercent = (Math.random() * 4 - 1.8);
          const newPrice = Math.max(1, a.currentPrice * (1 + deltaPercent / 100));
          return {
            ...a,
            currentPrice: Number(newPrice.toFixed(2)),
            change24h: Number((a.change24h + deltaPercent * 0.2).toFixed(2))
          };
        });
      });

      const now = new Date();
      const timeStr = now.toLocaleTimeString();
      setLastFetchTime(timeStr);
      setIsFetchingAsync(false);

      // Prepare Jackson payload preview
      const samplePayload = {
        timestamp: now.toISOString(),
        feed: 'NSE_BSE_SimulatedREST',
        status: 200,
        quotes: [
          { symbol: 'RELIANCE', price: 2995.50, changePercent: '+1.85%', volume: 3840200 },
          { symbol: 'TCS', price: 4245.00, changePercent: '+1.15%', volume: 1210400 },
          { symbol: 'INFY', price: 1860.00, changePercent: '+2.30%', volume: 4920100 }
        ]
      };
      setActiveJsonPayload(JSON.stringify(samplePayload, null, 2));
    }, 900);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Top Quick Status Ribbon */}
      <div className="bg-slate-900 text-slate-100 rounded-xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-white">Local SQLite Database: Active</span>
              <span className="text-xs bg-slate-800 text-emerald-300 font-mono px-2 py-0.5 rounded border border-slate-700">
                portfolio_tracker.db
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              JDBC Driver: org.sqlite.JDBC • CompletableFuture Background Poller: Every 60s
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSqlInspector(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            Inspect SQL (JDBC)
          </button>

          <button
            onClick={() => {
              if (!activeJsonPayload) simulateAsyncMarketTick();
              setShowJacksonJson(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            Jackson JSON DTO
          </button>

          <button
            onClick={() => setShowReportModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
          >
            <FileDown className="w-3.5 h-3.5" />
            Monthly Report
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Net Worth */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Net Worth</span>
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <IndianRupee className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              ₹{metrics.netWorth.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Liquid Cash + Market Asset Valuation</p>
        </div>

        {/* Liquid Cash */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Liquid Cash Reserves</span>
            <span className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <Wallet className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              ₹{metrics.liquidCash.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Checking + Savings Accounts</p>
        </div>

        {/* Total Expenses this Month */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly Expenditures</span>
            <span className="p-2 bg-rose-50 text-rose-700 rounded-lg">
              <TrendingDown className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-600 font-mono">
              ₹{metrics.totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Savings Rate: <span className="font-semibold text-emerald-600">{metrics.savingsRate.toFixed(1)}%</span>
          </p>
        </div>

        {/* Unrealized Portfolio P&L */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unrealized Portfolio P&amp;L</span>
            <span className={`p-2 rounded-lg ${metrics.unrealizedGain >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono ${metrics.unrealizedGain >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {metrics.unrealizedGain >= 0 ? '+' : ''}₹{metrics.unrealizedGain.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-semibold px-1.5 py-0.5 bg-slate-100 rounded text-slate-700">
              {metrics.unrealizedGainPercent >= 0 ? '+' : ''}{metrics.unrealizedGainPercent.toFixed(2)}%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Multi-Asset Holdings: ₹{metrics.portfolioValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Transaction Input & Transaction Table (7 cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* Data Management (CRUD Form with Validation) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Data Management &amp; Processing (CRUD Input)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Validates inputs before constructing TransactionModel and executing parameterized PreparedStatement.
                </p>
              </div>
            </div>

            {/* Validation Feedback Messages */}
            {validationError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <div>
                  <span className="font-bold">Validation Rejection:</span> {validationError}
                </div>
              </div>
            )}

            {validationSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                <div>{validationSuccess}</div>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Type */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Entry Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as TransactionType)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-800 focus:outline-indigo-500"
                  >
                    <option value="EXPENSE">Expense (Living / Student)</option>
                    <option value="INCOME">Income / Stipend</option>
                    <option value="ASSET_BUY">Asset Purchase (Investment)</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category Tag</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-800 focus:outline-indigo-500"
                  >
                    <option value="Groceries & Dining">Groceries &amp; Dining</option>
                    <option value="Rent & Housing">Rent &amp; Housing</option>
                    <option value="Tuition & Books">Tuition &amp; Books</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Utilities & Subscriptions">Utilities &amp; Subscriptions</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Investment Deposit">Investment Deposit</option>
                    <option value="Other">Other / Miscellaneous</option>
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Amount (₹ INR) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 1850.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-800 focus:outline-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date (ISO-8601) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-800 focus:outline-indigo-500"
                  />
                </div>

                {/* Account */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Source Account</label>
                  <select
                    value={account}
                    onChange={(e) => setAccount(e.target.value as any)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-800 focus:outline-indigo-500"
                  >
                    <option value="Checking">Checking Account</option>
                    <option value="Savings">Savings Account</option>
                    <option value="Brokerage Cash">Brokerage Cash</option>
                    <option value="Crypto Wallet">Crypto Wallet</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Note / Description <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Monthly Supermarket Haul, Metro Pass"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-800 focus:outline-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end pt-1">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  Save Record (JDBC Insert)
                </button>
              </div>
            </form>
          </div>

          {/* Transaction Ledger Table with Search & Filter */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Local Transaction Ledger</h3>
                <p className="text-xs text-slate-500">Persistent rows in SQLite `transactions` table.</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search note or tag..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="text-xs border border-slate-300 rounded-lg pl-8 pr-2.5 py-1.5 w-44 bg-white text-slate-800 focus:outline-indigo-500"
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="text-xs border border-slate-300 rounded-lg px-2 py-1.5 bg-white text-slate-800 focus:outline-indigo-500"
                >
                  <option value="ALL">All Tags</option>
                  <option value="Groceries & Dining">Groceries</option>
                  <option value="Rent & Housing">Rent</option>
                  <option value="Tuition & Books">Tuition</option>
                  <option value="Transportation">Transit</option>
                  <option value="Investment Deposit">Investment</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Category Tag</th>
                    <th className="py-2.5 px-3">Account</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-400">
                        No transactions found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-mono text-slate-500">{t.date}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-900">{t.description}</td>
                        <td className="py-2.5 px-3">
                          <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-700">
                            {t.category}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">{t.account}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold">
                          <span className={t.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-900'}>
                            {t.type === 'INCOME' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Delete transaction"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: Market Pipeline & Charts & Alerts (5 cols) */}
        <div className="lg:col-span-5 space-y-6">

          {/* Live Market Pipeline */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Live Market Pipeline (Async DTO)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  CompletableFuture asynchronous worker • Last polled: {lastFetchTime}
                </p>
              </div>

              <button
                onClick={simulateAsyncMarketTick}
                disabled={isFetchingAsync}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFetchingAsync ? 'animate-spin' : ''}`} />
                {isFetchingAsync ? 'Polling...' : 'Trigger Poll'}
              </button>
            </div>

            {/* Asset Holdings Cards */}
            <div className="space-y-2.5">
              {assets.map((asset) => {
                const totalVal = asset.shares * asset.currentPrice;
                const gain = totalVal - (asset.shares * asset.averageBuyPrice);
                const isPositive = asset.change24h >= 0;

                return (
                  <div key={asset.id} className="p-3 rounded-lg border border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">{asset.symbol}</span>
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-200/60 px-1.5 py-0.2 rounded">
                          {asset.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {asset.shares} shares @ avg ₹{asset.averageBuyPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="font-mono text-xs font-bold text-slate-900">
                        ₹{asset.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className={`text-[11px] font-mono flex items-center justify-end gap-0.5 ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {isPositive ? '+' : ''}{asset.change24h}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Module 2: Budget Threshold Warning Engine */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">
                Budget Threshold &amp; Alert Engine
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">80% Warn / 100% Critical</span>
            </div>

            <div className="space-y-3 pt-1">
              {budgets.map((b) => {
                // compute actual current spent from active transactions
                const actualSpent = transactions
                  .filter(t => t.type === 'EXPENSE' && t.category === b.category)
                  .reduce((sum, t) => sum + t.amount, 0);

                const percent = (actualSpent / b.monthlyLimit) * 100;
                let statusBadge = (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    Normal
                  </span>
                );

                if (percent >= 100) {
                  statusBadge = (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Exceeded!
                    </span>
                  );
                } else if (percent >= 80) {
                  statusBadge = (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Warning (80%+)
                    </span>
                  );
                }

                return (
                  <div key={b.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-800">{b.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-500">
                          ₹{actualSpent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ₹{b.monthlyLimit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        {statusBadge}
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          percent >= 100 ? 'bg-rose-500' : percent >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, percent)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visual Analytics (Pie Chart & Trend) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Visual Analytics (JavaFX Charts)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">PieChart Breakdown &amp; Monthly Trajectory</p>
              </div>
            </div>

            {/* Visual SVG Donut/Pie Chart */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Expense Distribution by Category
              </h4>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* SVG Donut */}
                <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    {/* Background circle */}
                    <path
                      className="text-slate-100"
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {/* Colored arcs */}
                    {(() => {
                      let accumulated = 0;
                      return categoryBreakdown.map((item, idx) => {
                        const pct = parseFloat(item.percentage);
                        const strokeDasharray = `${pct} ${100 - pct}`;
                        const strokeDashoffset = -accumulated;
                        accumulated += pct;

                        return (
                          <circle
                            key={idx}
                            cx="18"
                            cy="18"
                            r="15.9155"
                            fill="transparent"
                            stroke={item.color}
                            strokeWidth="4.2"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                          />
                        );
                      });
                    })()}
                  </svg>
                  <div className="absolute text-center">
                    <span className="block text-xs font-bold text-slate-900 font-mono">
                      ₹{metrics.totalExpense.toFixed(0)}
                    </span>
                    <span className="block text-[9px] text-slate-400 font-medium uppercase">Total</span>
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-1.5 text-xs w-full">
                  {categoryBreakdown.map((item) => (
                    <div key={item.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                        <span className="text-slate-700 truncate max-w-[120px]">{item.category}</span>
                      </div>
                      <span className="font-mono text-slate-500 font-medium">
                        {item.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Net Worth Trend SVG Mini Line Chart */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Net Worth Growth Trend (JavaFX LineChart)
                </h4>
                <span className="text-[10px] text-emerald-600 font-semibold font-mono">+12.4% this quarter</span>
              </div>

              <div className="h-24 w-full bg-slate-50 rounded-lg p-2 flex items-end relative overflow-hidden border border-slate-100">
                <svg className="w-full h-full" viewBox="0 0 300 80" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Fill area */}
                  <polygon
                    points="0,70 40,65 80,60 130,52 180,48 230,35 300,18 300,80 0,80"
                    fill="url(#grad)"
                  />
                  {/* Trend line */}
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    points="0,70 40,65 80,60 130,52 180,48 230,35 300,18"
                  />
                  {/* Points */}
                  <circle cx="0" cy="70" r="3" fill="#047857" />
                  <circle cx="80" cy="60" r="3" fill="#047857" />
                  <circle cx="180" cy="48" r="3" fill="#047857" />
                  <circle cx="300" cy="18" r="3" fill="#047857" />
                </svg>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Jun 2026</span>
                <span>Jul 2026</span>
                <span>Aug 2026</span>
                <span>Sep 2026</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Modal: Jackson JSON DTO Inspector */}
      {showJacksonJson && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-sm">Jackson JSON DTO Deserializer</h3>
              </div>
              <button 
                onClick={() => setShowJacksonJson(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-xs text-slate-600">
                Payload ingested by <code className="text-xs bg-slate-100 px-1 py-0.5 rounded font-mono">JacksonParser.java</code> from the asynchronous <code className="text-xs bg-slate-100 px-1 py-0.5 rounded font-mono">CompletableFuture</code> HTTP client pipeline:
              </p>
              <pre className="p-3 bg-slate-900 text-blue-300 font-mono text-xs rounded-lg overflow-x-auto max-h-64">
                {activeJsonPayload || `{\n  "timestamp": "2026-09-17T06:07:39Z",\n  "status": 200,\n  "quotes": [\n    { "symbol": "RELIANCE", "price": 2995.50, "change24h": 1.85 },\n    { "symbol": "TCS", "price": 4245.00, "change24h": 1.15 },\n    { "symbol": "INFY", "price": 1860.00, "change24h": 2.30 }\n  ]\n}`}
              </pre>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowJacksonJson(false)}
                  className="px-4 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: SQLite JDBC Inspector */}
      {showSqlInspector && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm">SQLite JDBC Transaction Inspector</h3>
              </div>
              <button 
                onClick={() => setShowSqlInspector(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-xs text-slate-600">
                Most recent parameterized JDBC operation executed against <code className="text-xs bg-slate-100 px-1 py-0.5 rounded font-mono">portfolio_tracker.db</code>:
              </p>
              <pre className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-lg overflow-x-auto max-h-64 leading-relaxed">
                {lastExecutedSql}
              </pre>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowSqlInspector(false)}
                  className="px-4 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Monthly Report Generator */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-xl w-full overflow-hidden border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileDown className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm">Monthly Financial Health Summary</h3>
              </div>
              <button 
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm text-slate-800">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2 font-mono text-xs">
                <div className="font-bold text-slate-900 border-b border-slate-200 pb-1">
                  FINANCIAL SUMMARY FOR SEPTEMBER 2026
                </div>
                <div className="flex justify-between">
                  <span>Gross Inflow (Stipend/Income):</span>
                  <span className="font-bold text-emerald-600">₹{metrics.totalIncome.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Living Expenditures:</span>
                  <span className="font-bold text-rose-600">₹{metrics.totalExpense.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Net Savings Generated:</span>
                  <span className="font-bold">₹{(metrics.totalIncome - metrics.totalExpense).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Savings Rate:</span>
                  <span className="font-bold text-emerald-600">{metrics.savingsRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Portfolio Asset Value:</span>
                  <span className="font-bold">₹{metrics.portfolioValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Unrealized Gain / Loss:</span>
                  <span className="font-bold text-emerald-600">{metrics.unrealizedGain >= 0 ? '+' : ''}₹{metrics.unrealizedGain.toFixed(2)}</span>
                </div>
              </div>

              <p className="text-xs text-slate-500">
                Generated automatically by <code className="font-mono">FinancialReportService.java</code> using compiled transactional records.
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
