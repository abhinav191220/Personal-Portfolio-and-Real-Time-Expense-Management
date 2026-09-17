package com.portfolio.finance.controller;

import com.portfolio.finance.db.DatabaseManager;
import com.portfolio.finance.model.AssetHolding;
import com.portfolio.finance.model.BudgetCategory;
import com.portfolio.finance.model.TransactionModel;
import com.portfolio.finance.service.BudgetAlertEngine;
import com.portfolio.finance.service.MarketDataService;
import javafx.application.Platform;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.chart.PieChart;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;

import java.math.BigDecimal;
import java.net.URL;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Controller orchestrating JavaFX presentation, responsive UI bindings, and database actions.
 */
public class DashboardController implements Initializable {

    private static final Logger LOGGER = Logger.getLogger(DashboardController.class.getName());

    // KPI Metrics Labels
    @FXML private Label lblNetWorth;
    @FXML private Label lblLiquidCash;
    @FXML private Label lblMonthlyExpenses;
    @FXML private Label lblPortfolioPnL;

    // Transaction Form Controls
    @FXML private ComboBox<TransactionModel.TransactionType> cbTxnType;
    @FXML private ComboBox<String> cbCategory;
    @FXML private TextField txtAmount;
    @FXML private DatePicker dpDate;
    @FXML private TextField txtDescription;
    @FXML private ComboBox<String> cbAccount;
    @FXML private Button btnAddTransaction;

    // Transaction TableView
    @FXML private TableView<TransactionModel> tblTransactions;
    @FXML private TableColumn<TransactionModel, String> colDate;
    @FXML private TableColumn<TransactionModel, String> colDescription;
    @FXML private TableColumn<TransactionModel, String> colCategory;
    @FXML private TableColumn<TransactionModel, String> colAccount;
    @FXML private TableColumn<TransactionModel, TransactionModel.TransactionType> colType;
    @FXML private TableColumn<TransactionModel, BigDecimal> colAmount;

    // Portfolio TableView
    @FXML private TableView<AssetHolding> tblHoldings;
    @FXML private TableColumn<AssetHolding, String> colSymbol;
    @FXML private TableColumn<AssetHolding, String> colName;
    @FXML private TableColumn<AssetHolding, Double> colShares;
    @FXML private TableColumn<AssetHolding, BigDecimal> colBuyPrice;
    @FXML private TableColumn<AssetHolding, BigDecimal> colCurrentPrice;
    @FXML private TableColumn<AssetHolding, Double> col24hChange;

    // Category Distribution Chart
    @FXML private PieChart chartExpenseCategories;

    // Observable collections
    private final ObservableList<TransactionModel> transactionData = FXCollections.observableArrayList();
    private final ObservableList<AssetHolding> holdingData = FXCollections.observableArrayList();
    private final Map<String, BigDecimal> budgetCaps = new LinkedHashMap<>();

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        LOGGER.info("Initializing JavaFX Dashboard Controller...");
        initComboBoxes();
        initTableColumns();
        initBudgetCaps();
        loadDataFromDatabase();
        recalculateFinancialMetrics();
    }

    private void initComboBoxes() {
        cbTxnType.setItems(FXCollections.observableArrayList(TransactionModel.TransactionType.values()));
        cbTxnType.setValue(TransactionModel.TransactionType.EXPENSE);

        cbCategory.setItems(FXCollections.observableArrayList(
                "Rent & Housing", "Groceries & Dining", "Tuition & Books",
                "Transportation", "Utilities & Subscriptions", "Entertainment", "Other"
        ));
        cbCategory.setValue("Groceries & Dining");

        cbAccount.setItems(FXCollections.observableArrayList("Checking", "Savings", "Brokerage Cash"));
        cbAccount.setValue("Checking");

        dpDate.setValue(LocalDate.now());
    }

    private void initTableColumns() {
        colDate.setCellValueFactory(new PropertyValueFactory<>("date"));
        colDescription.setCellValueFactory(new PropertyValueFactory<>("description"));
        colCategory.setCellValueFactory(new PropertyValueFactory<>("category"));
        colAccount.setCellValueFactory(new PropertyValueFactory<>("account"));
        colType.setCellValueFactory(new PropertyValueFactory<>("type"));
        colAmount.setCellValueFactory(new PropertyValueFactory<>("amount"));

        tblTransactions.setItems(transactionData);

        colSymbol.setCellValueFactory(new PropertyValueFactory<>("symbol"));
        colName.setCellValueFactory(new PropertyValueFactory<>("name"));
        colShares.setCellValueFactory(new PropertyValueFactory<>("shares"));
        colBuyPrice.setCellValueFactory(new PropertyValueFactory<>("averageBuyPrice"));
        colCurrentPrice.setCellValueFactory(new PropertyValueFactory<>("currentPrice"));
        col24hChange.setCellValueFactory(new PropertyValueFactory<>("change24hPercent"));

        tblHoldings.setItems(holdingData);
    }

    private void initBudgetCaps() {
        budgetCaps.put("Rent & Housing", BigDecimal.valueOf(10000.00));
        budgetCaps.put("Groceries & Dining", BigDecimal.valueOf(5000.00));
        budgetCaps.put("Tuition & Books", BigDecimal.valueOf(2500.00));
        budgetCaps.put("Transportation", BigDecimal.valueOf(1800.00));
        budgetCaps.put("Utilities & Subscriptions", BigDecimal.valueOf(1500.00));
        budgetCaps.put("Entertainment", BigDecimal.valueOf(1500.00));
    }

    private void loadDataFromDatabase() {
        try {
            transactionData.clear();
            transactionData.addAll(DatabaseManager.getInstance().getAllTransactions());

            holdingData.clear();
            holdingData.addAll(DatabaseManager.getInstance().getAllHoldings());
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Failed loading records from SQLite: " + e.getMessage(), e);
        }
    }

    @FXML
    public void handleAddTransaction() {
        try {
            String desc = txtDescription.getText();
            String amtStr = txtAmount.getText();
            if (amtStr == null || amtStr.trim().isEmpty()) {
                showAlert(Alert.AlertType.WARNING, "Validation Error", "Please enter a valid monetary amount.");
                return;
            }

            BigDecimal amount = new BigDecimal(amtStr.trim());
            TransactionModel txn = new TransactionModel(
                    null,
                    cbTxnType.getValue(),
                    cbCategory.getValue(),
                    amount,
                    dpDate.getValue(),
                    desc,
                    cbAccount.getValue()
            );

            // Persist to SQLite
            DatabaseManager.getInstance().insertTransaction(txn);
            transactionData.add(0, txn);

            // Clear inputs
            txtDescription.clear();
            txtAmount.clear();
            dpDate.setValue(LocalDate.now());

            recalculateFinancialMetrics();
            checkBudgetAlertsAfterAdd(txn);
        } catch (NumberFormatException nfe) {
            showAlert(Alert.AlertType.ERROR, "Invalid Amount", "Please input numeric characters (e.g. 1450.00).");
        } catch (Exception ex) {
            showAlert(Alert.AlertType.ERROR, "Error", ex.getMessage());
        }
    }

    @FXML
    public void handleRefreshMarketPipeline() {
        LOGGER.info("Initiating asynchronous stock ticker ingestion pipeline...");
        MarketDataService.getInstance().refreshHoldingsAsync(updatedHolding -> {
            Platform.runLater(() -> {
                for (int i = 0; i < holdingData.size(); i++) {
                    if (holdingData.get(i).getSymbol().equals(updatedHolding.getSymbol())) {
                        holdingData.set(i, updatedHolding);
                        break;
                    }
                }
                recalculateFinancialMetrics();
            });
        });
    }

    @FXML
    public void handleDeleteSelectedTransaction() {
        TransactionModel selected = tblTransactions.getSelectionModel().getSelectedItem();
        if (selected != null) {
            try {
                DatabaseManager.getInstance().deleteTransaction(selected.getId());
                transactionData.remove(selected);
                recalculateFinancialMetrics();
            } catch (SQLException e) {
                showAlert(Alert.AlertType.ERROR, "Database Error", "Failed to delete record: " + e.getMessage());
            }
        }
    }

    private void recalculateFinancialMetrics() {
        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpense = BigDecimal.ZERO;
        Map<String, Double> expenseByCategory = new HashMap<>();

        for (TransactionModel t : transactionData) {
            if (t.getType() == TransactionModel.TransactionType.INCOME) {
                totalIncome = totalIncome.add(t.getAmount());
            } else if (t.getType() == TransactionModel.TransactionType.EXPENSE) {
                totalExpense = totalExpense.add(t.getAmount());
                expenseByCategory.merge(t.getCategory(), t.getAmount().doubleValue(), Double::sum);
            }
        }

        BigDecimal portfolioVal = BigDecimal.ZERO;
        BigDecimal portfolioCost = BigDecimal.ZERO;
        for (AssetHolding h : holdingData) {
            portfolioVal = portfolioVal.add(h.getCurrentMarketValue());
            portfolioCost = portfolioCost.add(h.getTotalInvestedValue());
        }

        BigDecimal liquidCash = BigDecimal.valueOf(45000.00).add(totalIncome).subtract(totalExpense);
        BigDecimal netWorth = liquidCash.add(portfolioVal);
        BigDecimal pnl = portfolioVal.subtract(portfolioCost);

        lblNetWorth.setText(String.format("₹%,.2f", netWorth));
        lblLiquidCash.setText(String.format("₹%,.2f", liquidCash));
        lblMonthlyExpenses.setText(String.format("₹%,.2f", totalExpense));
        lblPortfolioPnL.setText(String.format("₹%,.2f", pnl));

        // Update PieChart
        ObservableList<PieChart.Data> pieChartData = FXCollections.observableArrayList();
        for (Map.Entry<String, Double> entry : expenseByCategory.entrySet()) {
            pieChartData.add(new PieChart.Data(entry.getKey(), entry.getValue()));
        }
        chartExpenseCategories.setData(pieChartData);
    }

    private void checkBudgetAlertsAfterAdd(TransactionModel txn) {
        if (txn.getType() != TransactionModel.TransactionType.EXPENSE) return;

        var evaluations = BudgetAlertEngine.evaluate(new ArrayList<>(transactionData), budgetCaps);
        for (var eval : evaluations) {
            if (eval.getCategory().equals(txn.getCategory())) {
                if (eval.getStatus() == BudgetCategory.AlertStatus.CRITICAL) {
                    showAlert(Alert.AlertType.WARNING, "Budget Exceeded!",
                            String.format("You have exceeded 100%% of your %s budget! Spent: ₹%,.2f / ₹%,.2f",
                                    eval.getCategory(), eval.getSpent(), eval.getLimit()));
                } else if (eval.getStatus() == BudgetCategory.AlertStatus.WARNING) {
                    showAlert(Alert.AlertType.INFORMATION, "Budget Warning",
                            String.format("You have reached %.1f%% of your %s monthly cap.",
                                    eval.getPercentage(), eval.getCategory()));
                }
            }
        }
    }

    private void showAlert(Alert.AlertType type, String title, String content) {
        Alert alert = new Alert(type);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(content);
        alert.showAndWait();
    }
}
