package com.portfolio.finance;

import com.portfolio.finance.model.BudgetCategory;
import com.portfolio.finance.model.TransactionModel;
import com.portfolio.finance.service.BudgetAlertEngine;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Core JUnit 5 test suite verifying transaction domain validation and budget alert thresholds.
 */
public class FinancialSuiteTest {

    @Test
    @DisplayName("Should reject transaction with negative or zero monetary amount")
    public void shouldRejectInvalidTransactionAmount() {
        Assertions.assertThrows(IllegalArgumentException.class, () -> {
            new TransactionModel(
                    "TXN-ERR-1",
                    TransactionModel.TransactionType.EXPENSE,
                    "Groceries & Dining",
                    BigDecimal.valueOf(-500.00),
                    LocalDate.now(),
                    "Illegal Negative Transaction",
                    "Checking"
            );
        });
    }

    @Test
    @DisplayName("Should reject transaction with blank or empty description")
    public void shouldRejectEmptyDescription() {
        Assertions.assertThrows(IllegalArgumentException.class, () -> {
            new TransactionModel(
                    "TXN-ERR-2",
                    TransactionModel.TransactionType.EXPENSE,
                    "Utilities",
                    BigDecimal.valueOf(150.00),
                    LocalDate.now(),
                    "   ",
                    "Checking"
            );
        });
    }

    @Test
    @DisplayName("Should trigger WARNING alert when spending crosses 80% threshold")
    public void shouldTriggerWarningThreshold() {
        TransactionModel txn = new TransactionModel(
                "TXN-TEST-1",
                TransactionModel.TransactionType.EXPENSE,
                "Groceries & Dining",
                BigDecimal.valueOf(4250.00),
                LocalDate.now(),
                "Supermarket Haul",
                "Checking"
        );

        Map<String, BigDecimal> limits = Map.of("Groceries & Dining", BigDecimal.valueOf(5000.00));
        var results = BudgetAlertEngine.evaluate(List.of(txn), limits);

        Assertions.assertEquals(1, results.size());
        Assertions.assertEquals(BudgetCategory.AlertStatus.WARNING, results.get(0).getStatus());
        Assertions.assertEquals(85.0, results.get(0).getPercentage(), 0.01);
    }

    @Test
    @DisplayName("Should trigger CRITICAL alert when spending exceeds 100% threshold")
    public void shouldTriggerCriticalThreshold() {
        TransactionModel txn = new TransactionModel(
                "TXN-TEST-2",
                TransactionModel.TransactionType.EXPENSE,
                "Rent & Housing",
                BigDecimal.valueOf(10500.00),
                LocalDate.now(),
                "Apartment Rent & Repairs",
                "Checking"
        );

        Map<String, BigDecimal> limits = Map.of("Rent & Housing", BigDecimal.valueOf(10000.00));
        var results = BudgetAlertEngine.evaluate(List.of(txn), limits);

        Assertions.assertEquals(1, results.size());
        Assertions.assertEquals(BudgetCategory.AlertStatus.CRITICAL, results.get(0).getStatus());
        Assertions.assertTrue(results.get(0).getPercentage() > 100.0);
    }
}
