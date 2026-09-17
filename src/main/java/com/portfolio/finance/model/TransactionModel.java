package com.portfolio.finance.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;

/**
 * Immutable and observable Domain Model representing a single financial transaction.
 * Supports Income, Expense, and Asset Buy/Sell allocations.
 */
public class TransactionModel {

    public enum TransactionType {
        INCOME,
        EXPENSE,
        ASSET_BUY,
        ASSET_SELL
    }

    private String id;
    private TransactionType type;
    private String category;
    private BigDecimal amount;
    private LocalDate date;
    private String description;
    private String account;

    public TransactionModel() {
        this.id = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        this.date = LocalDate.now();
    }

    public TransactionModel(String id, TransactionType type, String category, BigDecimal amount, LocalDate date, String description, String account) {
        this.id = id != null ? id : "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        this.type = Objects.requireNonNull(type, "Transaction type cannot be null");
        this.category = Objects.requireNonNull(category, "Category cannot be null");
        this.amount = Objects.requireNonNull(amount, "Amount cannot be null");
        this.date = Objects.requireNonNull(date, "Date cannot be null");
        this.description = Objects.requireNonNull(description, "Description cannot be null");
        this.account = Objects.requireNonNull(account, "Account cannot be null");

        validate();
    }

    public void validate() {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Transaction amount must be strictly positive and greater than zero.");
        }
        if (description == null || description.trim().isEmpty()) {
            throw new IllegalArgumentException("Transaction description cannot be null or empty.");
        }
        if (category == null || category.trim().isEmpty()) {
            throw new IllegalArgumentException("Transaction category must be specified.");
        }
        if (date == null) {
            throw new IllegalArgumentException("Transaction date must be provided.");
        }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TransactionModel)) return false;
        TransactionModel that = (TransactionModel) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "TransactionModel{" +
                "id='" + id + '\'' +
                ", type=" + type +
                ", category='" + category + '\'' +
                ", amount=" + amount +
                ", date=" + date +
                ", description='" + description + '\'' +
                ", account='" + account + '\'' +
                '}';
    }
}
