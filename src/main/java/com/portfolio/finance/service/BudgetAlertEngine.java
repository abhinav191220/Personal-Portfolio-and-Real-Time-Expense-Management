package com.portfolio.finance.service;

import com.portfolio.finance.model.BudgetCategory;
import com.portfolio.finance.model.TransactionModel;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Budget Analysis & Alert Evaluation Engine.
 * Monitors 80% Warning and 100% Critical overspending thresholds.
 */
public class BudgetAlertEngine {

    public static class CategoryHealthSummary {
        private final String category;
        private final BigDecimal limit;
        private final BigDecimal spent;
        private final double percentage;
        private final BudgetCategory.AlertStatus status;

        public CategoryHealthSummary(String category, BigDecimal limit, BigDecimal spent, double percentage, BudgetCategory.AlertStatus status) {
            this.category = category;
            this.limit = limit;
            this.spent = spent;
            this.percentage = percentage;
            this.status = status;
        }

        public String getCategory() { return category; }
        public BigDecimal getLimit() { return limit; }
        public BigDecimal getSpent() { return spent; }
        public double getPercentage() { return percentage; }
        public BudgetCategory.AlertStatus getStatus() { return status; }
    }

    public static List<CategoryHealthSummary> evaluate(List<TransactionModel> transactions, Map<String, BigDecimal> budgetLimits) {
        Map<String, BigDecimal> spentMap = new HashMap<>();

        for (TransactionModel txn : transactions) {
            if (txn.getType() == TransactionModel.TransactionType.EXPENSE) {
                spentMap.merge(txn.getCategory(), txn.getAmount(), BigDecimal::add);
            }
        }

        List<CategoryHealthSummary> summaries = new ArrayList<>();
        for (Map.Entry<String, BigDecimal> entry : budgetLimits.entrySet()) {
            String category = entry.getKey();
            BigDecimal limit = entry.getValue();
            BigDecimal spent = spentMap.getOrDefault(category, BigDecimal.ZERO);

            double percentage = limit.compareTo(BigDecimal.ZERO) > 0
                    ? (spent.doubleValue() / limit.doubleValue()) * 100.0
                    : 0.0;

            BudgetCategory.AlertStatus status;
            if (percentage >= 100.0) {
                status = BudgetCategory.AlertStatus.CRITICAL;
            } else if (percentage >= 80.0) {
                status = BudgetCategory.AlertStatus.WARNING;
            } else {
                status = BudgetCategory.AlertStatus.SAFE;
            }

            summaries.add(new CategoryHealthSummary(category, limit, spent, percentage, status));
        }

        return summaries;
    }
}
