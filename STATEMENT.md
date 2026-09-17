# Personal Portfolio & Real-Time Expense Management
## Project Statement & Architectural Specification

---

### 1. Title & Executive Summary

**Project Title:** Personal Portfolio & Real-Time Expense Management  
**Target Platform:** Desktop Application (Cross-Platform via OpenJDK 17+ / JavaFX 21+)  
**Primary Tech Stack:** Core Java (JDK 17+), JavaFX, JDBC, SQLite, Jackson (FasterXML), JUnit 5  

#### Executive Summary
The **Personal Portfolio & Real-Time Expense Dashboard** is an offline-first, privacy-centric desktop application engineered for university students, young working professionals, and novice retail investors. Designed to combat financial fragmentation, the application consolidates personal transaction tracking (incomes, daily living expenses, category allocations) and multi-asset retail investment monitoring (equities, index funds, and cryptocurrency holdings) into a cohesive, responsive desktop interface. 

Leveraging local SQLite persistence via transactional JDBC drivers, multithreaded asynchronous REST client pipelines powered by `CompletableFuture`, robust JSON serialization/deserialization via Jackson, and reactive JavaFX data visualizations, the system delivers instantaneous financial transparency without subjecting personal financial records to third-party cloud hosting or recurring SaaS subscription fees.

---

### 2. Problem Statement

#### 2.1 The Crisis of Fragmented Financial Management
Modern university students and young professionals encounter an increasingly fractured personal finance landscape:
- **Disparate Financial Silos:** Typical users maintain checking and savings across one or more retail banks, digital payment wallets (e.g., Venmo, PayPal, UPI), credit cards, and independent investment or brokerage applications (e.g., Robinhood, Fidelity, Coinbase).
- **Manual Spreadsheet Fatigue:** Many attempt to aggregate this information using manual spreadsheets (Excel, Google Sheets). Spreadsheets suffer from lack of data integrity enforcement, manual data-entry friction, broken formulas, and an utter absence of real-time market data ingestion.
- **Disconnected Investment Portfolios:** Investment portfolios are tracked in separate brokerage tools that fail to contextualize asset gains/losses within the user's immediate monthly cash flow and living expenses.

#### 2.2 Consequences of Lacking Real-Time Financial Visibility
- **Runaway Discretionary Spending & Poor Budgeting:** Without unified, immediate category-level visibility, users inadvertently overspend on dining, leisure, and subscriptions, realizing their deficit only when monthly statements arrive.
- **Missed Savings Goals:** Lack of proactive threshold warnings inhibits disciplined savings allocations towards emergency funds, tuition payments, or long-term investments.
- **Unmonitored Investment Exposure:** Volatile market swings in equity and crypto positions go unmonitored or panic-sold because users cannot evaluate market drawdowns against their overarching net worth and liquid cash reserves.

---

### 3. Target Users & Use Cases

#### 3.1 Primary User Persona: The University Student
- **Profile:** Undergraduate or graduate student balancing student loan allowances, scholarships, familial support, and part-time hourly work.
- **Key Challenges:** Strict budgetary caps, irregular paychecks, and high sensitivity to small recurring expenses.
- **Core Use Case:** 
  - Rapidly logging daily cafeteria, textbook, and transit expenses.
  - Setting a strict monthly discretionary food/entertainment budget (e.g., ₹5,000/month).
  - Receiving visual warnings when expenditures approach 80% and 100% of defined thresholds.
  - Tracking minor micro-investments in index funds or crypto without paying for premium software.

#### 3.2 Secondary User Persona: The Young Working Professional & Novice Investor
- **Profile:** Recent graduate or early-career professional earning a fixed salary, paying rent/utilities, managing credit cards, and allocating discretionary capital into retail equities and crypto assets.
- **Key Challenges:** Balancing aggressive student debt payoff or savings targets with active multi-asset portfolio tracking.
- **Core Use Case:**
  - Recording fixed bi-weekly salary deposits and automated monthly billings (rent, utilities, insurance).
  - Monitoring holdings in equities (e.g., AAPL, NVDA, SPY) and cryptocurrencies (e.g., BTC, ETH) with automatic live market price refreshes.
  - Evaluating net worth trajectories through dynamic historical line charts and asset allocation pie charts.
  - Generating exportable monthly financial health statements before tax preparation or financial reviews.

---

### 4. Scope of the Project

#### 4.1 In-Scope Capabilities
The application strictly encompasses the following functional capabilities:
- **Local SQLite Data Persistence:** Zero-configuration, file-based embedded database using ACID-compliant SQLite via JDBC.
- **Full Transaction Lifecycle Management:** Complete Create, Read, Update, and Delete (CRUD) operations for income streams, categorized expenditures, and investment transactions.
- **Input Validation & Data Sanitization:** Rigorous defense against malformed inputs, negative currency amounts, future dates, and orphan foreign keys.
- **Asynchronous Live Market Data Ingestion:** Background HTTP polling of public financial REST APIs (e.g., Alpha Vantage, Finnhub, CoinGecko, or simulated offline mock fixtures) using `CompletableFuture` and Jackson JSON deserializers.
- **Automated Threshold & Alert Engine:** Real-time calculation of expense budget consumption percentages and user-configurable asset price spike/dip notifications.
- **Visual Analytics & Reporting GUI:** Native JavaFX user interface with embedded charts (Pie Chart for category breakdown, Line Chart for historical net worth and expense trends) and monthly markdown/text report generation.

#### 4.2 Out-of-Scope Boundaries (Explicit Non-Goals)
To guarantee strict project boundaries, security adherence, and timely execution, the following are explicitly out of scope:
- **Real-Money Banking Execution:** The application does NOT execute wire transfers, Automated Clearing House (ACH) transactions, or brokerage buy/sell orders.
- **Direct Bank Credential Scraping (Plaid / Open Banking API):** No storage or transmission of user banking credentials or Plaid tokens. All transactions are logged by user input or standard CSV import.
- **Multi-Tenant Cloud Server Hosting:** The application does not deploy a remote multi-tenant backend server or cloud-hosted database.
- **Cloud Account Synchronization & Cross-Device Sync:** Data is maintained exclusively on the local machine; cross-device sync and centralized user authentication servers are excluded.
- **High-Frequency Algorithmic Trading:** The system is an analytical monitoring tool, not an automated trading bot or order routing engine.

---

### 5. Core High-Level Feature Modules

```
+-----------------------------------------------------------------------------------+
|               Personal Portfolio & Real-Time Expense Dashboard                    |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ Module 1: Data Management ]    [ Module 2: Live Market Pipeline ]              |
|  * SQLite Database Engine         * CompletableFuture Async Worker                |
|  * JDBC CRUD Repositories         * Jackson JSON Payload Deserializer             |
|  * Strict Validation & Sanitizing * Budget Alert & Price Movement Engine          |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                 [ Module 3: Visual Analytics & Reporting UI ]               |  |
|  |  * Responsive JavaFX Stage & FXML Views                                     |  |
|  |  * Dynamic PieChart (Expenses by Category) & LineChart (Net Worth Over Time) |  |
|  |  * Automated Monthly Financial Summaries & Threshold Health Indicators      |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

#### Module 1: Data Management & Processing (CRUD Operations)
1. **Secure Local SQLite Persistence via JDBC:**
   - Establishes a lightweight, zero-latency connection pool to a local `portfolio_tracker.db` file.
   - Enforces relational foreign key constraints across `accounts`, `categories`, `transactions`, and `portfolio_holdings` tables.
   - Executes parameterized PreparedStatements to prevent SQL injection vulnerabilities.
2. **Full CRUD Operations:**
   - **Income & Expense Operations:** Add, view, edit, and soft-delete financial transactions with timestamp, amount, category tag, note, and payment method.
   - **Portfolio Asset Records:** Record asset acquisitions (ticker symbol, asset class [STOCK/CRYPTO], quantity purchased, buy price, purchase date) and sales transactions.
   - **Category Tagging:** Customizable hierarchy (e.g., Housing, Groceries, Utilities, Tuition, Tech, Investments).
3. **Robust Input Validation & Data Sanitization:**
   - Strict numeric validation rejecting negative or zero expense entries where inappropriate.
   - ISO-8601 date parsing (`java.time.LocalDate`) verifying dates are non-empty and not set to unreasonable future milestones.
   - Mandatory field verification (missing ticker symbols, blank category names, or malformed numeric inputs trigger visual feedback without throwing uncaught runtime exceptions).

#### Module 2: Live Market Pipeline (Data Ingestion & Simulation)
1. **Multi-Threaded Asynchronous Background Ingestion:**
   - Employs Java's modern `CompletableFuture` and daemon thread pools (`Executors.newScheduledThreadPool`) to poll external financial endpoints periodically (e.g., every 60 seconds).
   - Guarantees the JavaFX Application Thread (UI) remains 100% fluid and responsive at 60 FPS, with zero micro-stutter during network calls.
   - Built-in fallback to mock historical feeds when running offline or encountering API rate-limits (HTTP 429).
2. **High-Performance JSON Deserialization with Jackson:**
   - Utilizes Jackson's `ObjectMapper` and typed Data Transfer Objects (DTOs) to parse JSON payloads into immutable Java model records.
   - Handles polymorphic asset types (Equity quotes vs. Crypto spot tickers) with fault-tolerant custom deserializers.
3. **Automated Budget Alerts & Asset Price Movement Monitor:**
   - Background comparative evaluation against user-defined budget thresholds:
     - Warning at 80% category utilization.
     - Critical alert at 100% budget breach.
   - Price movement trigger flagging asset intraday percentage shifts exceeding user-selected parameters (e.g., ±5% change).

#### Module 3: Visual Analytics & Reporting UI (Simulation & Visualization)
1. **Interactive, Responsive JavaFX GUI:**
   - Clean, high-contrast desktop layout organized into a master dashboard view, an asset ledger, an expense manager, and a reporting workbench.
   - Modular FXML layout backed by dedicated JavaFX controllers and CSS stylesheets.
2. **Dynamic Data Visualizations:**
   - **PieChart Breakdown:** Renders percentage expenditure allocations by category with hover tooltips and dynamic color-coded legends.
   - **LineChart Trend Analysis:** Plots total net worth growth, cumulative expenses, and liquid cash trajectory across 30-day, 90-day, and 1-year time windows.
   - **Portfolio Summary Metrics:** Instantaneous calculation of Unrealized Gain/Loss, Portfolio Value, and Daily P&L.
3. **Automated Financial Reporting & Status Exports:**
   - Single-click compilation of Monthly Financial Health Summaries detailing gross income, total expenditures, net savings rate, and portfolio appreciation.
   - Export capability to formatted Markdown (`.md`) and plain text summaries for external backup or record-keeping.

---

### 6. Alignment with Technical Expectations

#### 6.1 Clean Modular Architecture (8+ Core Java Classes)
The codebase adheres to the Model-View-Controller (MVC) and Data Access Object (DAO) design patterns, cleanly separating concerns across specialized classes:

| # | Class Name | Layer / Responsibility |
|---|------------|------------------------|
| 1 | `MainApp.java` | JavaFX application lifecycle entry point, primary stage initialization, and dependency wiring. |
| 2 | `DatabaseManager.java` | SQLite JDBC driver initialization, connection pooling, schema migration, and transaction management. |
| 3 | `TransactionDao.java` | Data Access Object managing SQL queries, inserts, updates, and deletes for financial transactions. |
| 4 | `PortfolioDao.java` | Data Access Object managing portfolio assets, holding quantities, and historical purchase prices. |
| 5 | `MarketDataService.java` | Asynchronous REST pipeline using `CompletableFuture` and `HttpClient` for live price fetching. |
| 6 | `JacksonParser.java` | Jackson `ObjectMapper` utility wrapper for robust JSON-to-DTO parsing and error recovery. |
| 7 | `BudgetAlertEngine.java` | Pure business logic engine evaluating category spend against thresholds and computing warnings. |
| 8 | `DashboardController.java` | JavaFX UI controller orchestrating UI events, chart data binding, and user input validation. |
| 9 | `TransactionModel.java` | Immutable Java domain model representing an expense/income record. |
| 10 | `FinancialReportService.java`| Automated reporting utility computing monthly summaries, cash flow ratios, and export generation. |

#### 6.2 Robust Error Handling Strategy
- **Defensive Input Handling:** Validation occurs prior to model instantiation. Form validation errors are bound to observable JavaFX UI properties to provide immediate visual cueing (red border highlights, descriptive error tooltips) without modal interruption.
- **Fail-Safe Network Pipeline:** Network timeouts, unreachable endpoints, or HTTP error codes are gracefully intercepted inside `CompletableFuture.exceptionally()`. The application automatically degrades to cached SQLite asset prices and updates the UI status bar with a clear "Offline / Cached Data" indicator.
- **Transactional Integrity:** All batch modifications in SQLite are wrapped inside atomic JDBC transactions (`connection.setAutoCommit(false)`) with rollback handling upon `SQLException`.

#### 6.3 Comprehensive Unit Testing via JUnit 5
The application is fortified by an automated JUnit 5 test suite covering domain logic and data integrity:
- **`TransactionValidationTest.java`:** Verifies input sanitization edge cases (zero amounts, negative values, leap year dates, future timestamps, empty strings).
- **`BudgetAlertEngineTest.java`:** Tests budget threshold percentage calculations (79% no alert, 81% warning alert, 105% over-budget alert).
- **`JacksonParserTest.java`:** Validates parsing of real and simulated financial API JSON structures, ensuring resilient mapping even when unexpected API fields are encountered.
- **`DatabaseCrudTest.java`:** In-memory SQLite test suite confirming referential integrity, record updates, and transaction rollback mechanics.
