package com.portfolio.finance.model;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

/**
 * Budget Category entity defining spending limits and consumption thresholds.
 */
public class BudgetCategory {

    public enum AlertStatus {
        SAFE,
        WARNING,
        CRITICAL
    }

    private String categoryName;
    private BigDecimal monthlyLimit;
    private BigDecimal currentSpent;

    public BudgetCategory(String categoryName, BigDecimal monthlyLimit, BigDecimal currentSpent) {
        this.categoryName = Objects.requireNonNull(categoryName);
        this.monthlyLimit = Objects.requireNonNull(monthlyLimit);
        this.currentSpent = currentSpent != null ? currentSpent : BigDecimal.ZERO;
    }

    public double getPercentageUsed() {
        if (monthlyLimit.compareTo(BigDecimal.ZERO) <= 0) return 0.0;
        return currentSpent.divide(monthlyLimit, 4, RoundingMode.HALF_UP).doubleValue() * 100.0;
    }

    public AlertStatus getAlertStatus() {
        double pct = getPercentageUsed();
        if (pct >= 100.0) {
            return AlertStatus.CRITICAL;
        } else if (pct >= 80.0) {
            return AlertStatus.WARNING;
        }
        return AlertStatus.SAFE;
    }

    public BigDecimal getRemainingBudget() {
        return monthlyLimit.subtract(currentSpent);
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public BigDecimal getMonthlyLimit() {
        return monthlyLimit;
    }

    public void setMonthlyLimit(BigDecimal monthlyLimit) {
        this.monthlyLimit = monthlyLimit;
    }

    public BigDecimal getCurrentSpent() {
        return currentSpent;
    }

    public void setCurrentSpent(BigDecimal currentSpent) {
        this.currentSpent = currentSpent;
    }
}
