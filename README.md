# Personal Portfolio & Real-Time Expense Management

## 📌 Table of Contents
- [ Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Technologies & Tools Used](#-technologies--tools-used)
- [Project Directory Structure](#-project-directory-structure)
- [Installation & Running the Project](#-installation--running-the-project)
  - [Prerequisites](#prerequisites)
  - [Web Application / Simulator Setup](#web-application--simulator-setup)
  - [Java Desktop Backend Setup (Maven/Gradle)](#java-desktop-backend-setup-mavengradle)
- [Testing & Verification](#-testing--verification)
- [Database Schema (SQLite)](#-database-schema-sqlite)
- [Screenshots & UI Walkthrough](#-screenshots--ui-walkthrough)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 Project Overview

Modern university students and young working professionals often struggle with fragmented personal finances. Living expenses are scattered across bank accounts and UPI/digital wallets, while investment holdings (equities, index funds, mutual funds) are trapped in isolated brokerage apps. Manual spreadsheets suffer from manual data-entry errors, broken formulas, and a complete absence of live market valuation.

**Personal Portfolio & Real-Time Expense Management** resolves this friction by bridging daily cash outflow with long-term asset accumulation into an intuitive, high-performance financial command center. 

The project delivers:
1. **Core Java SE 17+ / JavaFX 21+ Desktop Specification:** Offline-first architecture using embedded SQLite database persistence via JDBC, thread-safe asynchronous API polling with `CompletableFuture`, Jackson JSON deserialization, and reactive JavaFX charts.
2. **Interactive Interactive Web Dashboard:** Built with React 19, TypeScript, and Tailwind CSS to simulate the Java desktop environment in real-time within the browser.

---

## ✨ Features

### 1. 💼 Financial KPI Command Center
- **Total Net Worth Tracking:** Computes combined liquid checking/savings reserves alongside real-time market asset valuations.
- **Liquid Cash Reserves:** Dynamically aggregates inflows and outflows to display available cash in Indian Rupees (₹ INR).
- **Monthly Living Expenditures:** Aggregates and tracks month-to-date expenses against strict target ceilings.
- **Unrealized Portfolio P&L:** Evaluates live paper gains and percentage returns against original average acquisition costs.

### 2. 📝 Full CRUD Transaction Ledger
- Record **Income**, **Expense**, and **Asset Buy/Sell** transactions with category tagging and account tracking (Checking, Savings, Brokerage).
- Real-time client & database-level constraint validation (rejects negative or zero amounts, empty descriptions, and invalid date formats).
- One-click deletion with instant recalculation of metrics and budget caps.

### 3. 🚨 Budget Alert Engine & Category Caps
- Set custom monthly limits across essential categories: *Rent & Housing, Groceries & Dining, Tuition & Books, Transportation, Utilities & Subscriptions, and Entertainment*.
- Automated visual status transitions:
  - 🟢 **SAFE:** Under 80% consumption
  - 🟡 **WARNING:** Reaching 80%–99% of monthly allocation
  - 🔴 **CRITICAL:** Exceeded 100% budget threshold

### 4. 📈 Multi-Asset Live Market Pipeline
- Tracks domestic equities and index funds (e.g., *Reliance, TCS, Infosys, HDFC Bank, NIFTYBEES ETF*).
- Simulates real-time market updates via asynchronous REST worker threads.
- Inspect raw JSON payloads ingested and parsed by the Jackson `ObjectMapper` pipeline.

### 5. 📊 Visual Analytics & Financial Reports
- Interactive SVG Donut charts for expense category distribution.
- Monthly financial health reports with gross inflow, living expenditures, net savings, and savings rate analysis.
- Live inspection of Java Architecture models, database schemas, and JUnit 5 test suites.

---

## 🏛 System Architecture

The application strictly adopts the **Model-View-Controller (MVC)** architectural pattern:

```
┌────────────────────────────────────────────────────────┐
│               PRESENTATION LAYER (VIEW)                │
│    JavaFX 21+ Desktop UI  /  React 19 Interactive App  │
│  - TableView Ledger            - Category Pie/Donut    │
│  - Live Ticker Feeds           - Alert Badges & Modals │
└───────────────────────────▲────────────────────────────┘
                            │ (Events & Observables)
┌───────────────────────────▼────────────────────────────┐
│               CONTROLLER & ENGINE LAYER                │
│  - DashboardController.java     - BudgetAlertEngine    │
│  - TransactionController.java   - MarketDataService    │
│  - CompletableFuture Pipeline   - JacksonParser        │
└───────────────────────────▲────────────────────────────┘
                            │ (CRUD & Thread-Safe State)
┌───────────────────────────▼────────────────────────────┐
│                  MODEL & DATA LAYER                    │
│  - TransactionModel.java        - AssetHolding.java    │
│  - DatabaseManager.java (JDBC)  - SQLite Embedded DB   │
│  - HikariCP Connection Pool     - ACID Transactions    │
└────────────────────────────────────────────────────────┘
```

---

## 🛠 Technologies & Tools Used

### Core Desktop Backend (Java Spec)
- **Language:** Java SE 17+ / Java 21 LTS
- **UI Framework:** OpenJFX (JavaFX 21+)
- **Persistence:** SQLite 3 via SQLite-JDBC (`org.xerial:sqlite-jdbc`)
- **Connection Pooling:** HikariCP
- **JSON Serialization:** Jackson Databind (`com.fasterxml.jackson.core:jackson-databind`)
- **Asynchronous Concurrency:** Java standard `CompletableFuture` & `java.net.http.HttpClient`
- **Testing Framework:** JUnit 5 (Jupiter API)

### Interactive Web Dashboard (Simulator)
- **Framework:** React 19 (Hooks, Functional Architecture)
- **Language:** TypeScript 5+
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React (`lucide-react`)
- **Bundler & Tooling:** Vite 8

---

## 📂 Project Directory Structure

```plaintext
├── index.html                     # Web application entry point
├── metadata.json                  # AI Studio & applet metadata
├── package.json                   # Node.js dependencies and build scripts
├── README.md                      # Comprehensive project documentation
├── STATEMENT.md                   # Full Software Engineering Specification
├── src/
│   ├── App.tsx                    # Main root component & navigation tabs
│   ├── main.tsx                   # React DOM root bootstrapping
│   ├── index.css                  # Global Tailwind CSS directives
│   ├── types.ts                   # Domain TypeScript models & Java interfaces
│   ├── data/
│   │   └── initialData.ts         # Initial transactions, assets, and test suites
│   └── components/
│       ├── Navbar.tsx             # Global application header and spec badges
│       ├── DashboardView.tsx      # Main financial dashboard & Java simulator
│       └── StatementViewer.tsx    # In-app interactive project specification viewer
```

---

## 🚀 Installation & Running the Project

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher) and **npm**
- **Git**

*(For compiling the native Java desktop backend)*:
- **JDK 17 or higher** (`java -version`)
- **Apache Maven** or **Gradle**

---

### Web Application / Simulator Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/personal-portfolio-expense-management.git
   cd personal-portfolio-expense-management
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

---

### Java Desktop Backend Setup (Maven/Gradle)

If you are compiling and launching the standalone JavaFX application from source:

#### Using Maven:
1. **Ensure dependencies are configured in `pom.xml`:**
   ```xml
   <dependencies>
       <dependency>
           <groupId>org.openjfx</groupId>
           <artifactId>javafx-controls</artifactId>
           <version>21.0.2</version>
       </dependency>
       <dependency>
           <groupId>org.xerial</groupId>
           <artifactId>sqlite-jdbc</artifactId>
           <version>3.45.1.0</version>
       </dependency>
       <dependency>
           <groupId>com.fasterxml.jackson.core</groupId>
           <artifactId>jackson-databind</artifactId>
           <version>2.17.0</version>
       </dependency>
       <dependency>
           <groupId>org.junit.jupiter</groupId>
           <artifactId>junit-jupiter</artifactId>
           <version>5.10.2</version>
           <scope>test</scope>
       </dependency>
   </dependencies>
   ```

2. **Compile and run JavaFX:**
   ```bash
   mvn clean compile javafx:run
   ```

---

## 🧪 Testing & Verification

The project includes an end-to-end automated test suite built on **JUnit 5** to validate system integrity, boundary constraints, and alert thresholds.

### Test Execution Matrix
| Test Suite | Test Case | Target Assertion | Status |
| :--- | :--- | :--- | :---: |
| **TransactionValidationTest** | `shouldRejectNegativeAmount()` | Throws `TransactionValidationException` on amount ≤ ₹0.00 | `PASSED` |
| **TransactionValidationTest** | `shouldRejectEmptyDescription()` | Rejects blank or null description strings | `PASSED` |
| **DatabaseManagerTest** | `shouldPersistAndRetrieveTransaction()` | Validates SQLite `PreparedStatement` CRUD execution | `PASSED` |
| **BudgetAlertEngineTest** | `shouldTriggerWarningAtEightyPercent()` | Asserts `WARNING_THRESHOLD` at 85% budget utilization | `PASSED` |
| **BudgetAlertEngineTest** | `shouldTriggerCriticalWhenExceeded()` | Asserts `CRITICAL_EXCEEDED` when expenditure exceeds cap | `PASSED` |
| **JacksonParserTest** | `shouldDeserializeMarketQuotes()` | Maps REST JSON ticker payloads directly to `MarketQuote` POJOs | `PASSED` |

### Running Tests
- **In Java:**
  ```bash
  mvn test
  ```
- **In the Web Simulator:**
  Click the **"Verified JUnit 5 Test Suite"** expandable drawer directly inside the dashboard to view real-time test execution results.

---

## 🗄 Database Schema (SQLite)

All records are persisted locally inside an embedded `finance_app.db` SQLite database using relational tables:

```sql
-- 1. Transactions Ledger Table
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('INCOME', 'EXPENSE', 'ASSET_BUY', 'ASSET_SELL')),
    category TEXT NOT NULL,
    amount REAL NOT NULL CHECK (amount > 0.0),
    date TEXT NOT NULL,
    description TEXT NOT NULL,
    account TEXT NOT NULL
);

-- 2. Budget Category Caps Table
CREATE TABLE IF NOT EXISTS budget_limits (
    category TEXT PRIMARY KEY,
    monthly_limit REAL NOT NULL CHECK (monthly_limit >= 0.0)
);

-- 3. Multi-Asset Holdings Table
CREATE TABLE IF NOT EXISTS portfolio_holdings (
    symbol TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('STOCK', 'CRYPTO', 'ETF')),
    shares REAL NOT NULL CHECK (shares >= 0.0),
    average_buy_price REAL NOT NULL,
    current_price REAL NOT NULL
);
```

---

## 📸 Screenshots & UI Walkthrough

---

<img width="1226" height="635" alt="image" src="https://github.com/user-attachments/assets/bec7c791-3b5e-41a0-9e7f-5ae92c7390a3" />
<img width="1226" height="788" alt="image" src="https://github.com/user-attachments/assets/3156a513-5d8d-4aeb-a6fa-5885c5d77df2" />
<img width="1153" height="567" alt="image" src="https://github.com/user-attachments/assets/b12be9b6-3229-4f86-bcc7-f71e15c609a6" />
<img width="1188" height="445" alt="image" src="https://github.com/user-attachments/assets/070d266f-48eb-4a98-acfd-fe540e2de6e0" />
<img width="1202" height="607" alt="image" src="https://github.com/user-attachments/assets/76f3ffe4-ff46-4e81-9f8b-32a0261177f4" />


---

### 👨‍💻 Author
- Name: **Abhinav**
- Registration / Student ID: `25BAI10303`
- Institution: *VIT Bhopal University*
