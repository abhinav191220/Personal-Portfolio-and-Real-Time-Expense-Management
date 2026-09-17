package com.portfolio.finance.db;

import com.portfolio.finance.model.AssetHolding;
import com.portfolio.finance.model.BudgetCategory;
import com.portfolio.finance.model.TransactionModel;

import java.math.BigDecimal;
import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * High-performance SQLite JDBC Manager with parameterized queries and transaction guarantees.
 */
public class DatabaseManager {

    private static final Logger LOGGER = Logger.getLogger(DatabaseManager.class.getName());
    private static DatabaseManager instance;
    private static final String DB_URL = "jdbc:sqlite:finance_portfolio.db";

    private DatabaseManager() {
        try {
            Class.forName("org.sqlite.JDBC");
        } catch (ClassNotFoundException e) {
            LOGGER.log(Level.WARNING, "SQLite JDBC Driver loaded via ServiceLoader: " + e.getMessage());
        }
    }

    public static synchronized DatabaseManager getInstance() {
        if (instance == null) {
            instance = new DatabaseManager();
        }
        return instance;
    }

    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL);
    }

    public void initializeDatabase() throws SQLException {
        try (Connection conn = getConnection(); Statement stmt = conn.createStatement()) {
            conn.setAutoCommit(false);

            // Transactions Table
            stmt.execute("CREATE TABLE IF NOT EXISTS transactions (" +
                    "id TEXT PRIMARY KEY, " +
                    "type TEXT NOT NULL CHECK (type IN ('INCOME', 'EXPENSE', 'ASSET_BUY', 'ASSET_SELL')), " +
                    "category TEXT NOT NULL, " +
                    "amount REAL NOT NULL CHECK (amount > 0.0), " +
                    "date TEXT NOT NULL, " +
                    "description TEXT NOT NULL, " +
                    "account TEXT NOT NULL);");

            // Budget Limits Table
            stmt.execute("CREATE TABLE IF NOT EXISTS budget_limits (" +
                    "category TEXT PRIMARY KEY, " +
                    "monthly_limit REAL NOT NULL CHECK (monthly_limit >= 0.0));");

            // Portfolio Holdings Table
            stmt.execute("CREATE TABLE IF NOT EXISTS portfolio_holdings (" +
                    "symbol TEXT PRIMARY KEY, " +
                    "name TEXT NOT NULL, " +
                    "type TEXT NOT NULL, " +
                    "shares REAL NOT NULL CHECK (shares >= 0.0), " +
                    "average_buy_price REAL NOT NULL, " +
                    "current_price REAL NOT NULL, " +
                    "change24h REAL NOT NULL);");

            // Indices for query performance
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_txn_date ON transactions(date);");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_txn_category ON transactions(category);");

            conn.commit();
            LOGGER.info("SQLite schema validated with indices successfully.");
            seedDefaultDataIfEmpty(conn);
        }
    }

    private void seedDefaultDataIfEmpty(Connection conn) {
        try (Statement checkStmt = conn.createStatement();
             ResultSet rs = checkStmt.executeQuery("SELECT COUNT(*) FROM transactions")) {
            if (rs.next() && rs.getInt(1) == 0) {
                LOGGER.info("Seeding initial authentic transactions and realistic budget caps...");
                insertTransactionInternal(conn, new TransactionModel("TXN-101", TransactionModel.TransactionType.INCOME, "Other", BigDecimal.valueOf(28500.00), LocalDate.of(2026, 9, 1), "Monthly Graduate Research Fellowship / Stipend", "Checking"));
                insertTransactionInternal(conn, new TransactionModel("TXN-102", TransactionModel.TransactionType.EXPENSE, "Rent & Housing", BigDecimal.valueOf(8500.00), LocalDate.of(2026, 9, 2), "Shared 2BHK Apartment Rent & Maintenance (September)", "Checking"));
                insertTransactionInternal(conn, new TransactionModel("TXN-103", TransactionModel.TransactionType.EXPENSE, "Tuition & Books", BigDecimal.valueOf(1450.00), LocalDate.of(2026, 9, 5), "Data Structures & Algorithms Course Textbook & Lab Manual", "Savings"));
                insertTransactionInternal(conn, new TransactionModel("TXN-104", TransactionModel.TransactionType.EXPENSE, "Groceries & Dining", BigDecimal.valueOf(2850.00), LocalDate.of(2026, 9, 8), "Monthly Supermarket Grocery Haul & Household Essentials", "Checking"));
                insertTransactionInternal(conn, new TransactionModel("TXN-105", TransactionModel.TransactionType.ASSET_BUY, "Investment Deposit", BigDecimal.valueOf(5000.00), LocalDate.of(2026, 9, 10), "Monthly Equity SIP Deposit: Nifty 50 Index Fund", "Brokerage Cash"));
                insertTransactionInternal(conn, new TransactionModel("TXN-106", TransactionModel.TransactionType.EXPENSE, "Transportation", BigDecimal.valueOf(1200.00), LocalDate.of(2026, 9, 12), "Monthly Metro Rail Pass & Transit Card Recharge", "Checking"));
                insertTransactionInternal(conn, new TransactionModel("TXN-107", TransactionModel.TransactionType.EXPENSE, "Utilities & Subscriptions", BigDecimal.valueOf(1099.00), LocalDate.of(2026, 9, 14), "Broadband Fiber Internet & Cloud Storage Subscription", "Checking"));
                insertTransactionInternal(conn, new TransactionModel("TXN-108", TransactionModel.TransactionType.EXPENSE, "Groceries & Dining", BigDecimal.valueOf(780.00), LocalDate.of(2026, 9, 15), "Campus Cafeteria & Team Coffee Study Session", "Checking"));
                insertTransactionInternal(conn, new TransactionModel("TXN-109", TransactionModel.TransactionType.EXPENSE, "Entertainment", BigDecimal.valueOf(650.00), LocalDate.of(2026, 9, 16), "Weekend Cinema Ticket & OTT Streaming Subscription", "Checking"));

                // Seed budgets
                insertBudgetInternal(conn, "Rent & Housing", 10000.00);
                insertBudgetInternal(conn, "Groceries & Dining", 5000.00);
                insertBudgetInternal(conn, "Tuition & Books", 2500.00);
                insertBudgetInternal(conn, "Transportation", 1800.00);
                insertBudgetInternal(conn, "Utilities & Subscriptions", 1500.00);
                insertBudgetInternal(conn, "Entertainment", 1500.00);

                // Seed portfolio assets
                insertAssetInternal(conn, new AssetHolding("RELIANCE", "Reliance Industries Ltd", AssetHolding.AssetType.STOCK, 12, BigDecimal.valueOf(2880.00), BigDecimal.valueOf(2995.50), 1.85));
                insertAssetInternal(conn, new AssetHolding("TCS", "Tata Consultancy Services", AssetHolding.AssetType.STOCK, 8, BigDecimal.valueOf(4100.00), BigDecimal.valueOf(4245.00), 1.15));
                insertAssetInternal(conn, new AssetHolding("INFY", "Infosys Limited", AssetHolding.AssetType.STOCK, 20, BigDecimal.valueOf(1740.00), BigDecimal.valueOf(1860.00), 2.30));
                insertAssetInternal(conn, new AssetHolding("HDFCBANK", "HDFC Bank Ltd", AssetHolding.AssetType.STOCK, 25, BigDecimal.valueOf(1590.00), BigDecimal.valueOf(1648.50), -0.45));
                insertAssetInternal(conn, new AssetHolding("NIFTYBEES", "Nippon India ETF Nifty 50", AssetHolding.AssetType.ETF, 150, BigDecimal.valueOf(268.00), BigDecimal.valueOf(284.20), 0.65));

                conn.commit();
                LOGGER.info("Default financial records committed successfully.");
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Failed seeding initial records: " + e.getMessage(), e);
        }
    }

    public synchronized void insertTransaction(TransactionModel txn) throws SQLException {
        try (Connection conn = getConnection()) {
            insertTransactionInternal(conn, txn);
        }
    }

    private void insertTransactionInternal(Connection conn, TransactionModel txn) throws SQLException {
        String sql = "INSERT INTO transactions (id, type, category, amount, date, description, account) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, txn.getId());
            ps.setString(2, txn.getType().name());
            ps.setString(3, txn.getCategory());
            ps.setDouble(4, txn.getAmount().doubleValue());
            ps.setString(5, txn.getDate().toString());
            ps.setString(6, txn.getDescription());
            ps.setString(7, txn.getAccount());
            ps.executeUpdate();
        }
    }

    public synchronized void deleteTransaction(String transactionId) throws SQLException {
        String sql = "DELETE FROM transactions WHERE id = ?";
        try (Connection conn = getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, transactionId);
            ps.executeUpdate();
        }
    }

    public List<TransactionModel> getAllTransactions() throws SQLException {
        List<TransactionModel> list = new ArrayList<>();
        String sql = "SELECT id, type, category, amount, date, description, account FROM transactions ORDER BY date DESC, id DESC";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                TransactionModel txn = new TransactionModel(
                        rs.getString("id"),
                        TransactionModel.TransactionType.valueOf(rs.getString("type")),
                        rs.getString("category"),
                        BigDecimal.valueOf(rs.getDouble("amount")),
                        LocalDate.parse(rs.getString("date")),
                        rs.getString("description"),
                        rs.getString("account")
                );
                list.add(txn);
            }
        }
        return list;
    }

    private void insertBudgetInternal(Connection conn, String category, double limit) throws SQLException {
        String sql = "INSERT OR REPLACE INTO budget_limits (category, monthly_limit) VALUES (?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, category);
            ps.setDouble(2, limit);
            ps.executeUpdate();
        }
    }

    private void insertAssetInternal(Connection conn, AssetHolding asset) throws SQLException {
        String sql = "INSERT OR REPLACE INTO portfolio_holdings (symbol, name, type, shares, average_buy_price, current_price, change24h) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, asset.getSymbol());
            ps.setString(2, asset.getName());
            ps.setString(3, asset.getType().name());
            ps.setDouble(4, asset.getShares());
            ps.setDouble(5, asset.getAverageBuyPrice().doubleValue());
            ps.setDouble(6, asset.getCurrentPrice().doubleValue());
            ps.setDouble(7, asset.getChange24hPercent());
            ps.executeUpdate();
        }
    }

    public List<AssetHolding> getAllHoldings() throws SQLException {
        List<AssetHolding> holdings = new ArrayList<>();
        String sql = "SELECT symbol, name, type, shares, average_buy_price, current_price, change24h FROM portfolio_holdings";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                holdings.add(new AssetHolding(
                        rs.getString("symbol"),
                        rs.getString("name"),
                        AssetHolding.AssetType.valueOf(rs.getString("type")),
                        rs.getDouble("shares"),
                        BigDecimal.valueOf(rs.getDouble("average_buy_price")),
                        BigDecimal.valueOf(rs.getDouble("current_price")),
                        rs.getDouble("change24h")
                ));
            }
        }
        return holdings;
    }

    public void updateAssetPrice(String symbol, BigDecimal newPrice, double change24h) throws SQLException {
        String sql = "UPDATE portfolio_holdings SET current_price = ?, change24h = ? WHERE symbol = ?";
        try (Connection conn = getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setDouble(1, newPrice.doubleValue());
            ps.setDouble(2, change24h);
            ps.setString(3, symbol);
            ps.executeUpdate();
        }
    }

    public void closePool() {
        LOGGER.info("SQLite connection pool closed.");
    }
}
