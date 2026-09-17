import { Transaction, AssetHolding, BudgetLimit, JavaClassDoc, UnitTestResult } from '../types';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-101',
    type: 'INCOME',
    category: 'Other',
    amount: 28500.00,
    date: '2026-09-01',
    description: 'Monthly Graduate Research Fellowship / Stipend',
    account: 'Checking'
  },
  {
    id: 'TXN-102',
    type: 'EXPENSE',
    category: 'Rent & Housing',
    amount: 8500.00,
    date: '2026-09-02',
    description: 'Shared 2BHK Apartment Rent & Maintenance (September)',
    account: 'Checking'
  },
  {
    id: 'TXN-103',
    type: 'EXPENSE',
    category: 'Tuition & Books',
    amount: 1450.00,
    date: '2026-09-05',
    description: 'Data Structures & Algorithms Course Textbook & Lab Manual',
    account: 'Savings'
  },
  {
    id: 'TXN-104',
    type: 'EXPENSE',
    category: 'Groceries & Dining',
    amount: 2850.00,
    date: '2026-09-08',
    description: 'Monthly Supermarket Grocery Haul & Household Essentials',
    account: 'Checking'
  },
  {
    id: 'TXN-105',
    type: 'ASSET_BUY',
    category: 'Investment Deposit',
    amount: 5000.00,
    date: '2026-09-10',
    description: 'Monthly Equity SIP Deposit: Nifty 50 Index Fund',
    account: 'Brokerage Cash'
  },
  {
    id: 'TXN-106',
    type: 'EXPENSE',
    category: 'Transportation',
    amount: 1200.00,
    date: '2026-09-12',
    description: 'Monthly Metro Rail Pass & Transit Card Recharge',
    account: 'Checking'
  },
  {
    id: 'TXN-107',
    type: 'EXPENSE',
    category: 'Utilities & Subscriptions',
    amount: 1099.00,
    date: '2026-09-14',
    description: 'Broadband Fiber Internet & Cloud Storage Subscription',
    account: 'Checking'
  },
  {
    id: 'TXN-108',
    type: 'EXPENSE',
    category: 'Groceries & Dining',
    amount: 780.00,
    date: '2026-09-15',
    description: 'Campus Cafeteria & Team Coffee Study Session',
    account: 'Checking'
  },
  {
    id: 'TXN-109',
    type: 'EXPENSE',
    category: 'Entertainment',
    amount: 650.00,
    date: '2026-09-16',
    description: 'Weekend Cinema Ticket & OTT Streaming Subscription',
    account: 'Checking'
  }
];

export const INITIAL_ASSETS: AssetHolding[] = [
  {
    id: 'AST-1',
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    type: 'STOCK',
    shares: 12,
    averageBuyPrice: 2880.00,
    currentPrice: 2995.50,
    change24h: 1.85
  },
  {
    id: 'AST-2',
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    type: 'STOCK',
    shares: 8,
    averageBuyPrice: 4100.00,
    currentPrice: 4245.00,
    change24h: 1.15
  },
  {
    id: 'AST-3',
    symbol: 'INFY',
    name: 'Infosys Limited',
    type: 'STOCK',
    shares: 20,
    averageBuyPrice: 1740.00,
    currentPrice: 1860.00,
    change24h: 2.30
  },
  {
    id: 'AST-4',
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    type: 'STOCK',
    shares: 25,
    averageBuyPrice: 1590.00,
    currentPrice: 1648.50,
    change24h: -0.45
  },
  {
    id: 'AST-5',
    symbol: 'NIFTYBEES',
    name: 'Nippon India ETF Nifty 50',
    type: 'STOCK',
    shares: 150,
    averageBuyPrice: 268.00,
    currentPrice: 284.20,
    change24h: 0.65
  }
];

export const INITIAL_BUDGETS: BudgetLimit[] = [
  { category: 'Rent & Housing', monthlyLimit: 10000.00, currentSpent: 8500.00 },
  { category: 'Groceries & Dining', monthlyLimit: 5000.00, currentSpent: 3630.00 },
  { category: 'Tuition & Books', monthlyLimit: 2500.00, currentSpent: 1450.00 },
  { category: 'Transportation', monthlyLimit: 1800.00, currentSpent: 1200.00 },
  { category: 'Utilities & Subscriptions', monthlyLimit: 1500.00, currentSpent: 1099.00 },
  { category: 'Entertainment', monthlyLimit: 1500.00, currentSpent: 650.00 }
];

export const JAVA_CLASSES: JavaClassDoc[] = [
  {
    name: 'MainApp.java',
    package: 'org.portfolio.app',
    layer: 'Application Entry / Lifecycle',
    description: 'Initializes the JavaFX Primary Stage, loads root FXML views, injects DatabaseManager and MarketDataService singletons, and registers shutdown hooks.',
    methods: ['start(Stage primaryStage)', 'stop()', 'main(String[] args)'],
    snippet: `public class MainApp extends Application {
    @Override
    public void start(Stage primaryStage) throws Exception {
        DatabaseManager.getInstance().initializeSchema();
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/views/dashboard.fxml"));
        Scene scene = new Scene(loader.load(), 1280, 800);
        primaryStage.setTitle("Personal Portfolio & Real-Time Expense Dashboard");
        primaryStage.setScene(scene);
        primaryStage.show();
    }
}`
  },
  {
    name: 'DatabaseManager.java',
    package: 'org.portfolio.db',
    layer: 'JDBC Persistence & Migration',
    description: 'Manages embedded SQLite connection pooling, executes DDL table creation schemas, and guarantees transactional ACID rollback upon SQL errors.',
    methods: ['getConnection()', 'initializeSchema()', 'executeTransaction(SqlConsumer action)'],
    snippet: `public class DatabaseManager {
    private static final String DB_URL = "jdbc:sqlite:portfolio_tracker.db";
    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL);
    }
    public void initializeSchema() {
        try (Statement stmt = getConnection().createStatement()) {
            stmt.execute("CREATE TABLE IF NOT EXISTS transactions (" +
                         "id TEXT PRIMARY KEY, type TEXT, category TEXT, " +
                         "amount REAL, date TEXT, description TEXT);");
        } catch (SQLException e) { logger.error("DB Init failed", e); }
    }
}`
  },
  {
    name: 'TransactionDao.java',
    package: 'org.portfolio.dao',
    layer: 'Data Access Object (CRUD)',
    description: 'Encapsulates all SQL PreparedStatements for transactions. Implements full CRUD with parameterized queries to eliminate SQL injection.',
    methods: ['insert(Transaction t)', 'findById(String id)', 'findAll()', 'update(Transaction t)', 'delete(String id)'],
    snippet: `public class TransactionDao {
    public void insert(Transaction t) throws SQLException {
        String sql = "INSERT INTO transactions VALUES (?, ?, ?, ?, ?, ?)";
        try (PreparedStatement ps = db.getConnection().prepareStatement(sql)) {
            ps.setString(1, t.id());
            ps.setString(2, t.type().name());
            ps.setString(3, t.category());
            ps.setDouble(4, t.amount());
            ps.setString(5, t.date().toString());
            ps.setString(6, t.description());
            ps.executeUpdate();
        }
    }
}`
  },
  {
    name: 'PortfolioDao.java',
    package: 'org.portfolio.dao',
    layer: 'Data Access Object (Assets)',
    description: 'Maintains holdings in equity and cryptocurrency tables. Calculates average cost basis and portfolio allocation metrics.',
    methods: ['getAllHoldings()', 'upsertHolding(AssetHolding a)', 'deleteHolding(String symbol)'],
    snippet: `public class PortfolioDao {
    public List<AssetHolding> getAllHoldings() throws SQLException {
        List<AssetHolding> list = new ArrayList<>();
        String query = "SELECT symbol, name, type, shares, avg_buy_price FROM holdings";
        try (ResultSet rs = db.getConnection().createStatement().executeQuery(query)) {
            while (rs.next()) {
                list.add(new AssetHolding(rs.getString("symbol"), rs.getDouble("shares"), ...));
            }
        }
        return list;
    }
}`
  },
  {
    name: 'MarketDataService.java',
    package: 'org.portfolio.network',
    layer: 'Live Pipeline & Async IO',
    description: 'Multi-threaded background worker fetching live ticker quotes using CompletableFuture without blocking the JavaFX Application Thread.',
    methods: ['fetchQuoteAsync(String ticker)', 'startPollingLoop(Duration interval)', 'shutdown()'],
    snippet: `public class MarketDataService {
    private final HttpClient client = HttpClient.newHttpClient();
    public CompletableFuture<MarketQuoteDTO> fetchQuoteAsync(String ticker) {
        HttpRequest req = HttpRequest.newBuilder().uri(buildUri(ticker)).build();
        return client.sendAsync(req, HttpResponse.BodyHandlers.ofString())
            .thenApply(HttpResponse::body)
            .thenApply(JacksonParser::parseQuote)
            .exceptionally(ex -> fallbackCachedQuote(ticker));
    }
}`
  },
  {
    name: 'JacksonParser.java',
    package: 'org.portfolio.util',
    layer: 'JSON Serialization / DTO',
    description: 'Configures Jackson FasterXML ObjectMapper with JavaTimeModule to safely deserialize JSON API payloads into immutable record models.',
    methods: ['parseQuote(String json)', 'toJson(Object obj)', 'parseBatchQuotes(String json)'],
    snippet: `public class JacksonParser {
    private static final ObjectMapper mapper = new ObjectMapper()
        .registerModule(new JavaTimeModule())
        .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    public static MarketQuoteDTO parseQuote(String json) {
        try {
            return mapper.readValue(json, MarketQuoteDTO.class);
        } catch (JsonProcessingException e) {
            throw new MarketParseException("Malformed quote payload", e);
        }
    }
}`
  },
  {
    name: 'BudgetAlertEngine.java',
    package: 'org.portfolio.service',
    layer: 'Business Logic & Rules Engine',
    description: 'Monitors ongoing expenditures against predefined category caps. Calculates 80% warning triggers and 100% hard-breach critical alerts.',
    methods: ['evaluateCategory(String category, double currentSpent, double limit)', 'getAlertStatus(String category)'],
    snippet: `public class BudgetAlertEngine {
    public AlertStatus evaluate(double spent, double limit) {
        if (limit <= 0) return AlertStatus.OK;
        double ratio = spent / limit;
        if (ratio >= 1.0) return AlertStatus.CRITICAL_EXCEEDED;
        if (ratio >= 0.80) return AlertStatus.WARNING_THRESHOLD;
        return AlertStatus.HEALTHY;
    }
}`
  },
  {
    name: 'DashboardController.java',
    package: 'org.portfolio.ui',
    layer: 'JavaFX Presentation Controller',
    description: 'FXML-bound controller wiring observable collections to JavaFX PieChart, LineChart, and TableView components with input validation bindings.',
    methods: ['initialize()', 'handleCreateTransaction()', 'refreshMarketQuotes()', 'exportMonthlyReport()'],
    snippet: `public class DashboardController implements Initializable {
    @FXML private TableView<Transaction> txnTable;
    @FXML private PieChart expensePieChart;
    @FXML private LineChart<String, Number> netWorthChart;

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        bindTableColumns();
        loadLocalData();
        marketService.startPollingLoop(Duration.ofSeconds(60));
    }
}`
  },
  {
    name: 'TransactionModel.java',
    package: 'org.portfolio.model',
    layer: 'Domain Entity',
    description: 'Immutable entity with strict domain validation (checking against negative values, null dates, and empty category strings).',
    methods: ['validate()', 'id()', 'amount()', 'category()', 'date()'],
    snippet: `public record TransactionModel(String id, TransactionType type, String category, double amount, LocalDate date, String note) {
    public TransactionModel {
        if (amount <= 0) throw new IllegalArgumentException("Amount must be positive");
        Objects.requireNonNull(category, "Category cannot be null");
        Objects.requireNonNull(date, "Date cannot be null");
    }
}`
  },
  {
    name: 'FinancialReportService.java',
    package: 'org.portfolio.service',
    layer: 'Reporting & Analytics',
    description: 'Aggregates monthly income vs expenses, computes savings rate percentages, and formats Markdown and plaintext summary reports.',
    methods: ['generateMonthlySummary(int month, int year)', 'exportToMarkdownFile(Path path)'],
    snippet: `public class FinancialReportService {
    public MonthlyReport generateSummary(YearMonth period) {
        double income = txnDao.sumByType(TransactionType.INCOME, period);
        double expense = txnDao.sumByType(TransactionType.EXPENSE, period);
        double savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;
        return new MonthlyReport(period, income, expense, savingsRate);
    }
}`
  }
];

export const JUNIT_TESTS: UnitTestResult[] = [
  {
    suite: 'TransactionValidationTest',
    testName: 'shouldRejectNegativeOrZeroExpenseAmount',
    durationMs: 8,
    status: 'PASSED',
    details: 'Verified IllegalArgumentException is thrown when amount = -45.00 or 0.00'
  },
  {
    suite: 'TransactionValidationTest',
    testName: 'shouldRejectNullOrEmptyCategoryTag',
    durationMs: 4,
    status: 'PASSED',
    details: 'Verified NullPointerException or validation error on blank category string'
  },
  {
    suite: 'TransactionValidationTest',
    testName: 'shouldRejectInvalidDateFormat',
    durationMs: 6,
    status: 'PASSED',
    details: 'Verified DateTimeParseException caught and transformed into user-friendly message'
  },
  {
    suite: 'BudgetAlertEngineTest',
    testName: 'shouldTriggerWarningAtEightyPercentConsumption',
    durationMs: 12,
    status: 'PASSED',
    details: 'Asserted WARNING_THRESHOLD when spent = ₹8,500.00 against limit = ₹10,000.00 (85%)'
  },
  {
    suite: 'BudgetAlertEngineTest',
    testName: 'shouldTriggerCriticalWhenLimitExceeded',
    durationMs: 5,
    status: 'PASSED',
    details: 'Asserted CRITICAL_EXCEEDED when spent = ₹10,250.00 against limit = ₹10,000.00'
  },
  {
    suite: 'JacksonParserTest',
    testName: 'shouldDeserializeStockPayloadWithUnknownAttributes',
    durationMs: 24,
    status: 'PASSED',
    details: 'Successfully mapped REST JSON ticker to MarketQuoteDTO ignoring auxiliary API tags'
  },
  {
    suite: 'JacksonParserTest',
    testName: 'shouldHandleIsoDateFormatsSeamlessly',
    durationMs: 15,
    status: 'PASSED',
    details: 'JavaTimeModule accurately deserialized "2026-09-17T06:00:00Z" to Instant'
  },
  {
    suite: 'DatabaseCrudTest',
    testName: 'shouldPerformAtomicBatchInsertWithRollbackOnFailure',
    durationMs: 42,
    status: 'PASSED',
    details: 'In-memory SQLite verified 0 rows committed after intentional constraint breach'
  }
];
