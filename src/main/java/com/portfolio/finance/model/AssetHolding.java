package com.portfolio.finance.model;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

/**
 * Domain entity representing an investment holding across Equities, Mutual Funds, and Crypto.
 */
public class AssetHolding {

    public enum AssetType {
        STOCK,
        CRYPTO,
        ETF,
        MUTUAL_FUND
    }

    private String symbol;
    private String name;
    private AssetType type;
    private double shares;
    private BigDecimal averageBuyPrice;
    private BigDecimal currentPrice;
    private double change24hPercent;

    public AssetHolding() {}

    public AssetHolding(String symbol, String name, AssetType type, double shares, BigDecimal averageBuyPrice, BigDecimal currentPrice, double change24hPercent) {
        this.symbol = Objects.requireNonNull(symbol, "Symbol cannot be null");
        this.name = Objects.requireNonNull(name, "Name cannot be null");
        this.type = Objects.requireNonNull(type, "Asset type cannot be null");
        this.shares = shares;
        this.averageBuyPrice = Objects.requireNonNull(averageBuyPrice, "Buy price cannot be null");
        this.currentPrice = Objects.requireNonNull(currentPrice, "Current price cannot be null");
        this.change24hPercent = change24hPercent;
    }

    public BigDecimal getTotalInvestedValue() {
        return averageBuyPrice.multiply(BigDecimal.valueOf(shares)).setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal getCurrentMarketValue() {
        return currentPrice.multiply(BigDecimal.valueOf(shares)).setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal getUnrealizedGainLoss() {
        return getCurrentMarketValue().subtract(getTotalInvestedValue());
    }

    public double getUnrealizedGainLossPercent() {
        BigDecimal invested = getTotalInvestedValue();
        if (invested.compareTo(BigDecimal.ZERO) == 0) return 0.0;
        return getUnrealizedGainLoss().divide(invested, 4, RoundingMode.HALF_UP).doubleValue() * 100.0;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public AssetType getType() {
        return type;
    }

    public void setType(AssetType type) {
        this.type = type;
    }

    public double getShares() {
        return shares;
    }

    public void setShares(double shares) {
        this.shares = shares;
    }

    public BigDecimal getAverageBuyPrice() {
        return averageBuyPrice;
    }

    public void setAverageBuyPrice(BigDecimal averageBuyPrice) {
        this.averageBuyPrice = averageBuyPrice;
    }

    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(BigDecimal currentPrice) {
        this.currentPrice = currentPrice;
    }

    public double getChange24hPercent() {
        return change24hPercent;
    }

    public void setChange24hPercent(double change24hPercent) {
        this.change24hPercent = change24hPercent;
    }
}
