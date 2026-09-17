import { useState } from 'react';
import { Copy, Check, Download, FileText, Bookmark, ArrowRight, ShieldCheck, Database, Cpu, PieChart } from 'lucide-react';

interface StatementViewerProps {
  onNavigateToSimulator?: () => void;
}

export const StatementViewer: React.FC<StatementViewerProps> = ({ onNavigateToSimulator }) => {
  const [copied, setCopied] = useState(false);

  const rawStatement = `# Personal Portfolio & Real-Time Expense Management
## Project Statement & Architectural Specification

---

### 1. Title & Executive Summary

**Project Title:** Personal Portfolio & Real-Time Expense Management  
**Target Platform:** Desktop Application (Cross-Platform via OpenJDK 17+ / JavaFX 21+)  
**Primary Tech Stack:** Core Java (JDK 17+), JavaFX, JDBC, SQLite, Jackson (FasterXML), JUnit 5  

#### Executive Summary
The **Personal Portfolio & Real-Time Expense Dashboard** is an offline-first, privacy-centric desktop application engineered for university students, young working professionals, and novice retail investors. Designed to combat financial fragmentation, the application consolidates personal transaction tracking (incomes, daily living expenses, category allocations) and multi-asset retail investment monitoring (equities, index funds, and cryptocurrency holdings) into a cohesive, responsive desktop interface. 

Leveraging local SQLite persistence via transactional JDBC drivers, multithreaded asynchronous REST client pipelines powered by \`CompletableFuture\`, robust JSON serialization/deserialization via Jackson, and reactive JavaFX data visualizations, the system delivers instantaneous financial transparency without subjecting personal financial records to third-party cloud hosting or recurring SaaS subscription fees.

---

### 2. Problem Statement

#### 2.1 The Crisis of Fragmented Financial Management
Modern university students and young professionals encounter an increasingly fractured personal finance landscape:
- **Disparate Financial Silos:** Typical users maintain checking and savings across one or more retail banks, digital payment wallets (e.g., Venmo, PayPal, UPI), credit cards, and independent investment or brokerage applications (e.g., Robinhood, Fidelity, Coinbase).
- **Manual Spreadsheet Fatigue:** Many attempt to aggregate this information using manual spreadsheets (Excel or online sheets). Spreadsheets suffer from lack of data integrity enforcement, manual data-entry friction, broken formulas, and an utter absence of real-time market data ingestion.
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
- **Asynchronous Live Market Data Ingestion:** Background HTTP polling of public financial REST APIs (e.g., Alpha Vantage, Finnhub, CoinGecko, or simulated offline mock fixtures) using \`CompletableFuture\` and Jackson JSON deserializers.
- **Automated Threshold & Alert Engine:** Real-time calculation of expense budget consumption percentages and user-configurable asset price spike/dip notifications.
- **Visual Analytics & Reporting GUI:** Native JavaFX user interface with embedded charts (Pie Chart for category breakdown, Line Chart for historical net worth and expense trends) and monthly markdown/text report generation.

#### 4.2 Out-of-Scope Boundaries (Explicit Non-Goals)
To guarantee strict project boundaries, security adherence, and timely execution, the following are explicitly out of scope:
- **Real-Money Banking Execution:** The application does NOT execute wire transfers, Automated Clearing House (ACH) transactions, or brokerage buy/sell orders.
- **Direct Bank Credential Scraping (Plaid / Open Banking API):** No storage or transmission of user banking credentials or Plaid tokens. All transactions are logged by user input or standard CSV import.
- **Multi-Tenant Cloud Server Hosting:** The application does not deploy a remote multi-tenant backend server or cloud-hosted database.
- **Cloud Account Synchronization & Cross-Device Sync:** Data is maintained exclusively on the local machine; cross-device sync and centralized user authentication servers are excluded.
- **High-Frequency Algorithmic Execution:** The system is an analytical monitoring tool, not an automated order routing engine.

---

### 5. Core High-Level Feature Modules

#### Module 1: Data Management & Processing (CRUD Operations)
1. **Secure Local SQLite Persistence via JDBC:**
   - Establishes a lightweight, zero-latency connection pool to a local \`portfolio_tracker.db\` file.
   - Enforces relational foreign key constraints across \`accounts\`, \`categories\`, \`transactions\`, and \`portfolio_holdings\` tables.
   - Executes parameterized PreparedStatements to prevent SQL injection vulnerabilities.
2. **Full CRUD Operations:**
   - **Income & Expense Operations:** Add, view, edit, and soft-delete financial transactions with timestamp, amount, category tag, note, and payment method.
   - **Portfolio Asset Records:** Record asset acquisitions (ticker symbol, asset class [STOCK/CRYPTO], quantity purchased, buy price, purchase date) and sales transactions.
   - **Category Tagging:** Customizable hierarchy (e.g., Housing, Groceries, Utilities, Tuition, Tech, Investments).
3. **Robust Input Validation & Data Sanitization:**
   - Strict numeric validation rejecting negative or zero expense entries where inappropriate.
   - ISO-8601 date parsing (\`java.time.LocalDate\`) verifying dates are non-empty and not set to unreasonable future milestones.
   - Mandatory field verification (missing ticker symbols, blank category names, or malformed numeric inputs trigger visual feedback without throwing uncaught runtime exceptions).

#### Module 2: Live Market Pipeline (Data Ingestion & Simulation)
1. **Multi-Threaded Asynchronous Background Ingestion:**
   - Employs Java's modern \`CompletableFuture\` and daemon thread pools (\`Executors.newScheduledThreadPool\`) to poll external financial endpoints periodically (e.g., every 60 seconds).
   - Guarantees the JavaFX Application Thread (UI) remains 100% fluid and responsive at 60 FPS, with zero micro-stutter during network calls.
   - Built-in fallback to mock historical feeds when running offline or encountering API rate-limits (HTTP 429).
2. **High-Performance JSON Deserialization with Jackson:**
   - Utilizes Jackson's \`ObjectMapper\` and typed Data Transfer Objects (DTOs) to parse JSON payloads into immutable Java model records.
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
   - Export capability to formatted Markdown (\`.md\`) and plain text summaries for external backup or record-keeping.

---

### 6. Alignment with Technical Expectations

#### 6.1 Clean Modular Architecture (8+ Core Java Classes)
The codebase adheres to the Model-View-Controller (MVC) and Data Access Object (DAO) design patterns:
1. \`MainApp.java\` - JavaFX application lifecycle entry point and dependency wiring.
2. \`DatabaseManager.java\` - SQLite JDBC driver initialization, connection pooling, and schema migration.
3. \`TransactionDao.java\` - Data Access Object managing SQL queries, inserts, updates, and deletes for financial transactions.
4. \`PortfolioDao.java\` - Data Access Object managing portfolio assets, holding quantities, and cost basis.
5. \`MarketDataService.java\` - Asynchronous REST pipeline using \`CompletableFuture\` and \`HttpClient\` for live price fetching.
6. \`JacksonParser.java\` - Jackson \`ObjectMapper\` utility wrapper for robust JSON-to-DTO parsing.
7. \`BudgetAlertEngine.java\` - Pure business logic engine evaluating category spend against thresholds.
8. \`DashboardController.java\` - JavaFX UI controller orchestrating UI events and chart bindings.
9. \`TransactionModel.java\` - Immutable Java domain model representing an expense/income record.
10. \`FinancialReportService.java\` - Automated reporting utility computing monthly summaries.

#### 6.2 Robust Error Handling Strategy
- **Defensive Input Handling:** Validation occurs prior to model instantiation. Form validation errors are bound to observable JavaFX UI properties.
- **Fail-Safe Network Pipeline:** Network timeouts are caught in \`CompletableFuture.exceptionally()\` with automatic fallback to cached SQLite prices.
- **Transactional Integrity:** All batch modifications in SQLite are wrapped inside atomic JDBC transactions (\`connection.setAutoCommit(false)\`).

#### 6.3 Comprehensive Unit Testing via JUnit 5
- \`TransactionValidationTest.java\`: Input sanitization edge cases (zero, negative, future dates, empty strings).
- \`BudgetAlertEngineTest.java\`: Budget threshold percentage calculations (79% ok, 81% warning, 105% critical).
- \`JacksonParserTest.java\`: Parsing of API JSON structures with unknown or missing attributes.
- \`DatabaseCrudTest.java\`: In-memory SQLite test suite confirming referential integrity and rollback mechanics.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(rawStatement);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([rawStatement], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'STATEMENT.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header card with action buttons */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 text-sm font-semibold tracking-wide uppercase mb-1">
            <ShieldCheck className="w-4 h-4" />
            Formal Specification Document
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Project Statement &amp; Specification
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Complete functional, architectural, and scope specification for the Personal Portfolio &amp; Real-Time Expense Dashboard.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            title="Copy markdown to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Markdown!' : 'Copy Document'}
          </button>
          
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors"
            title="Download Document"
          >
            <Download className="w-4 h-4" />
            Download Spec (.md)
          </button>
        </div>
      </div>

      {/* Module quick-jump indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Module 1: Data &amp; CRUD</h4>
            <p className="text-xs text-slate-500 mt-0.5">SQLite via JDBC, PreparedStatements, strict input validation &amp; sanitization.</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
          <div className="p-2 bg-blue-50 text-blue-700 rounded-lg shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Module 2: Live Market Pipeline</h4>
            <p className="text-xs text-slate-500 mt-0.5">CompletableFuture async polling, Jackson JSON DTOs, threshold alert engine.</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
          <div className="p-2 bg-purple-50 text-purple-700 rounded-lg shrink-0">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Module 3: Visual Analytics</h4>
            <p className="text-xs text-slate-500 mt-0.5">Responsive JavaFX GUI, PieChart &amp; LineChart, automated monthly health reports.</p>
          </div>
        </div>
      </div>

      {/* Rendered Document Body */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-8 text-slate-800 leading-relaxed font-sans">
        
        {/* Section 1 */}
        <section id="section-1" className="border-b border-slate-100 pb-8">
          <div className="inline-block px-2.5 py-0.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded mb-2">
            Section 1
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">1. Title &amp; Executive Summary</h2>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 text-sm space-y-1.5 mb-4">
            <p><span className="font-semibold text-slate-900">Project Title:</span> Personal Portfolio &amp; Real-Time Expense Management</p>
            <p><span className="font-semibold text-slate-900">Target Platform:</span> Cross-Platform Desktop (OpenJDK 17+ / JavaFX 21+)</p>
            <p><span className="font-semibold text-slate-900">Technology Stack:</span> Core Java, JavaFX, JDBC, SQLite, Jackson (FasterXML), JUnit 5</p>
          </div>
          <p className="text-slate-700 text-base">
            The <strong className="text-slate-900">Personal Portfolio &amp; Real-Time Expense Management</strong> application is an offline-first, privacy-centric desktop application engineered for university students, young working professionals, and novice retail investors. Designed to combat financial fragmentation, the application consolidates personal transaction tracking (incomes, daily living expenses, category allocations) and multi-asset retail investment monitoring (equities, index funds, and cryptocurrency holdings) into a cohesive, responsive desktop interface.
          </p>
          <p className="text-slate-700 text-base mt-3">
            Leveraging local SQLite persistence via transactional JDBC drivers, multithreaded asynchronous REST client pipelines powered by <code className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-800 text-sm font-mono">CompletableFuture</code>, robust JSON serialization/deserialization via Jackson, and reactive JavaFX data visualizations, the system delivers instantaneous financial transparency without subjecting personal financial records to third-party cloud hosting or recurring SaaS subscription fees.
          </p>
        </section>

        {/* Section 2 */}
        <section id="section-2" className="border-b border-slate-100 pb-8">
          <div className="inline-block px-2.5 py-0.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded mb-2">
            Section 2
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">2. Problem Statement</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">2.1 The Crisis of Fragmented Financial Management</h3>
              <p className="text-slate-700">
                Modern university students and young professionals encounter an increasingly fractured personal finance landscape:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1.5 text-slate-700 pl-2">
                <li><strong className="text-slate-900">Disparate Financial Silos:</strong> Typical users maintain checking and savings across one or more retail banks, digital payment wallets (e.g., Venmo, PayPal, UPI), credit cards, and independent investment or brokerage applications (e.g., Robinhood, Fidelity, Coinbase).</li>
                <li><strong className="text-slate-900">Manual Spreadsheet Fatigue:</strong> Many attempt to aggregate this information using manual spreadsheets (Excel or online sheets). Spreadsheets suffer from lack of data integrity enforcement, manual data-entry friction, broken formulas, and an utter absence of real-time market data ingestion.</li>
                <li><strong className="text-slate-900">Disconnected Investment Portfolios:</strong> Investment portfolios are tracked in separate brokerage tools that fail to contextualize asset gains/losses within the user&apos;s immediate monthly cash flow and living expenses.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">2.2 Consequences of Lacking Real-Time Financial Visibility</h3>
              <ul className="list-disc list-inside space-y-1.5 text-slate-700 pl-2">
                <li><strong className="text-slate-900">Runaway Discretionary Spending &amp; Poor Budgeting:</strong> Without unified, immediate category-level visibility, users inadvertently overspend on dining, leisure, and subscriptions, realizing their deficit only when monthly statements arrive.</li>
                <li><strong className="text-slate-900">Missed Savings Goals:</strong> Lack of proactive threshold warnings inhibits disciplined savings allocations towards emergency funds, tuition payments, or long-term investments.</li>
                <li><strong className="text-slate-900">Unmonitored Investment Exposure:</strong> Volatile market swings in equity and crypto positions go unmonitored or panic-sold because users cannot evaluate market drawdowns against their overarching net worth and liquid cash reserves.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section id="section-3" className="border-b border-slate-100 pb-8">
          <div className="inline-block px-2.5 py-0.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded mb-2">
            Section 3
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">3. Target Users &amp; Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="p-5 rounded-lg border border-slate-200 bg-slate-50/60">
              <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">Primary Persona</span>
              <h3 className="text-lg font-bold text-slate-900 mt-2">University Students</h3>
              <p className="text-sm text-slate-600 mt-1 mb-3">
                Balancing student allowances, scholarships, campus housing, and part-time hourly jobs.
              </p>
              <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-1.5">Key Use Cases:</h4>
              <ul className="text-sm space-y-1 text-slate-700 list-disc list-inside">
                <li>Rapid logging of daily cafeteria, textbook, and commute transit costs.</li>
                <li>Setting strict monthly caps (e.g., ₹5,000 for dining &amp; leisure).</li>
                <li>Proactive visual warnings when spend crosses 80% and 100% caps.</li>
                <li>Tracking beginner fractional index fund investments without subscription fees.</li>
              </ul>
            </div>

            <div className="p-5 rounded-lg border border-slate-200 bg-slate-50/60">
              <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">Secondary Persona</span>
              <h3 className="text-lg font-bold text-slate-900 mt-2">Young Professionals &amp; Novice Investors</h3>
              <p className="text-sm text-slate-600 mt-1 mb-3">
                Early-career professionals managing fixed salaries, rent/utilities, debt repayment, and multi-asset holdings.
              </p>
              <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-1.5">Key Use Cases:</h4>
              <ul className="text-sm space-y-1 text-slate-700 list-disc list-inside">
                <li>Logging fixed bi-weekly paychecks and automated recurring billings.</li>
                <li>Multi-asset portfolio monitoring (equities like AAPL, NVDA + crypto like BTC, ETH).</li>
                <li>Visualizing overall net worth expansion with historical line charts.</li>
                <li>Generating one-click monthly financial health reports for tax prep.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section id="section-4" className="border-b border-slate-100 pb-8">
          <div className="inline-block px-2.5 py-0.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded mb-2">
            Section 4
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">4. Scope of the Project</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-lg border border-emerald-200 bg-emerald-50/40">
              <h3 className="text-base font-bold text-emerald-950 flex items-center gap-1.5 mb-2">
                <Check className="w-4 h-4 text-emerald-600" />
                Explicitly IN-SCOPE (Local Desktop App)
              </h3>
              <ul className="text-sm space-y-2 text-slate-700 list-disc list-inside">
                <li><strong className="text-slate-900">Local SQLite DB Persistence:</strong> Zero-config embedded relational storage via JDBC.</li>
                <li><strong className="text-slate-900">Full Transaction CRUD:</strong> Incomes, expenses, and investment transactions.</li>
                <li><strong className="text-slate-900">Data Input Validation:</strong> Guarding against negative values, bad dates, and empty fields.</li>
                <li><strong className="text-slate-900">Real-Time REST Market Updates:</strong> Non-blocking background price updates via CompletableFuture.</li>
                <li><strong className="text-slate-900">Visual Charting:</strong> JavaFX Pie charts (expense breakdown) and Line charts (net worth growth).</li>
                <li><strong className="text-slate-900">Local Budget Alerts:</strong> 80% and 100% threshold indicators.</li>
              </ul>
            </div>

            <div className="p-5 rounded-lg border border-rose-200 bg-rose-50/40">
              <h3 className="text-base font-bold text-rose-950 flex items-center gap-1.5 mb-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
                Explicitly OUT-OF-SCOPE (Non-Goals)
              </h3>
              <ul className="text-sm space-y-2 text-slate-700 list-disc list-inside">
                <li><strong className="text-slate-900">Real-Money Banking Transactions:</strong> No ACH, wire transfers, or live trade execution.</li>
                <li><strong className="text-slate-900">Bank Credential Scraping:</strong> No Plaid or Open Banking credential storage.</li>
                <li><strong className="text-slate-900">Multi-User Web Hosting:</strong> Single-user local desktop application architecture.</li>
                <li><strong className="text-slate-900">Cloud Sync &amp; Auth:</strong> No remote servers, Firebase, or cloud accounts needed.</li>
                <li><strong className="text-slate-900">High-Frequency Automated Trading:</strong> Strictly informational analysis, not an execution engine.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section id="section-5" className="border-b border-slate-100 pb-8">
          <div className="inline-block px-2.5 py-0.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded mb-2">
            Section 5
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">5. Core High-Level Feature Modules</h2>
          
          <div className="space-y-6">
            {/* Module 1 */}
            <div className="p-5 rounded-lg border border-slate-200 bg-white shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 text-xs font-bold bg-slate-900 text-white rounded">Module 1</span>
                <h3 className="text-lg font-bold text-slate-900">Data Management &amp; Processing (CRUD Operations)</h3>
              </div>
              <ul className="text-sm text-slate-700 space-y-2 mt-2">
                <li><strong className="text-slate-900">Secure local SQLite persistence via JDBC:</strong> Auto-creates relational tables with primary/foreign keys and uses parameterized <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">PreparedStatement</code> instances to eliminate SQL injection.</li>
                <li><strong className="text-slate-900">Full CRUD operations:</strong> Create, Read, Update, and Delete actions for income streams, categorized expenses, and asset transactions.</li>
                <li><strong className="text-slate-900">Robust data input validation:</strong> Defensive filters rejecting negative amounts, malformed ISO dates, and blank tags before database transactions execute.</li>
              </ul>
            </div>

            {/* Module 2 */}
            <div className="p-5 rounded-lg border border-slate-200 bg-white shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 text-xs font-bold bg-slate-900 text-white rounded">Module 2</span>
                <h3 className="text-lg font-bold text-slate-900">Live Market Pipeline (Data Ingestion &amp; Simulation)</h3>
              </div>
              <ul className="text-sm text-slate-700 space-y-2 mt-2">
                <li><strong className="text-slate-900">Multi-threaded asynchronous background fetching:</strong> Uses <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">CompletableFuture</code> and daemon threads to retrieve live market quotes without blocking the JavaFX UI thread.</li>
                <li><strong className="text-slate-900">JSON parsing via Jackson:</strong> High-speed FasterXML Jackson deserializer mapping API payloads into immutable Java DTO records.</li>
                <li><strong className="text-slate-900">Automated threshold checking:</strong> Real-time engine calculating 80% warning and 100% budget breach alerts, plus asset volatility thresholds.</li>
              </ul>
            </div>

            {/* Module 3 */}
            <div className="p-5 rounded-lg border border-slate-200 bg-white shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 text-xs font-bold bg-slate-900 text-white rounded">Module 3</span>
                <h3 className="text-lg font-bold text-slate-900">Visual Analytics &amp; Reporting UI (Simulation &amp; Visualization)</h3>
              </div>
              <ul className="text-sm text-slate-700 space-y-2 mt-2">
                <li><strong className="text-slate-900">Interactive JavaFX GUI:</strong> Clean, responsive FXML layout designed for high productivity and intuitive desktop navigation.</li>
                <li><strong className="text-slate-900">Dynamic data visualization:</strong> Pie charts for expense breakdowns and Line charts for net worth growth trends over time.</li>
                <li><strong className="text-slate-900">Automated reporting:</strong> One-click generation of monthly financial health summaries and exportable budget status reports.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section id="section-6">
          <div className="inline-block px-2.5 py-0.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded mb-2">
            Section 6
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">6. Alignment with Technical Expectations</h2>
          <div className="space-y-4">
            <p className="text-slate-700 text-sm">
              The project is architected strictly according to industry-standard Java design patterns, featuring:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="text-sm font-bold text-slate-900">8+ Modular Java Classes</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Adheres to MVC and DAO patterns across <code className="text-xs">MainApp</code>, <code className="text-xs">DatabaseManager</code>, <code className="text-xs">TransactionDao</code>, <code className="text-xs">MarketDataService</code>, <code className="text-xs">JacksonParser</code>, <code className="text-xs">BudgetAlertEngine</code>, and controllers.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="text-sm font-bold text-slate-900">Robust Error Handling</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Defensive validation on input fields, atomic SQLite transaction rollbacks upon <code className="text-xs">SQLException</code>, and network fallbacks via <code className="text-xs">CompletableFuture.exceptionally()</code>.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="text-sm font-bold text-slate-900">JUnit 5 Test Coverage</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Automated test suites verifying input rejection (negatives, bad dates), budget threshold triggers, and Jackson JSON deserialization.
                </p>
              </div>
            </div>

            {onNavigateToSimulator && (
              <div className="pt-4 flex justify-end">
                <button
                  onClick={onNavigateToSimulator}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
                >
                  Explore Interactive Dashboard Simulator
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};
