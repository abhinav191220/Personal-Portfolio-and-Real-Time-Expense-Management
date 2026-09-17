package com.portfolio.finance.service;

import com.portfolio.finance.model.AssetHolding;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.concurrent.*;
import java.util.function.Consumer;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Non-blocking, asynchronous market quote ingestion service using CompletableFuture and HttpClient.
 */
public class MarketDataService {

    private static final Logger LOGGER = Logger.getLogger(MarketDataService.class.getName());
    private static MarketDataService instance;

    private final HttpClient httpClient;
    private final ScheduledExecutorService scheduler;
    private final ExecutorService workerPool;

    private MarketDataService() {
        this.workerPool = Executors.newFixedThreadPool(4, r -> {
            Thread t = new Thread(r, "MarketDataWorker");
            t.setDaemon(true);
            return t;
        });

        this.httpClient = HttpClient.newBuilder()
                .executor(workerPool)
                .connectTimeout(Duration.ofSeconds(5))
                .build();

        this.scheduler = Executors.newSingleThreadScheduledExecutor(r -> {
            Thread t = new Thread(r, "MarketDataScheduler");
            t.setDaemon(true);
            return t;
        });
    }

    public static synchronized MarketDataService getInstance() {
        if (instance == null) {
            instance = new MarketDataService();
        }
        return instance;
    }

    public CompletableFuture<String> fetchRawMarketPayloadAsync(String endpointUrl) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(endpointUrl))
                        .timeout(Duration.ofSeconds(4))
                        .GET()
                        .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
                if (response.statusCode() == 200) {
                    return response.body();
                } else {
                    return getSimulatedFallbackPayload();
                }
            } catch (Exception ex) {
                LOGGER.log(Level.WARNING, "Falling back to simulated real-time market quote: " + ex.getMessage());
                return getSimulatedFallbackPayload();
            }
        }, workerPool);
    }

    public CompletableFuture<Void> refreshHoldingsAsync(Consumer<AssetHolding> onHoldingUpdated) {
        return CompletableFuture.runAsync(() -> {
            try {
                var holdings = com.portfolio.finance.db.DatabaseManager.getInstance().getAllHoldings();
                for (AssetHolding holding : holdings) {
                    // Simulate random micro-volatility (-1.5% to +2.5%)
                    double deltaPct = (ThreadLocalRandom.current().nextDouble() * 4.0) - 1.5;
                    BigDecimal current = holding.getCurrentPrice();
                    BigDecimal multiplier = BigDecimal.valueOf(1.0 + (deltaPct / 100.0));
                    BigDecimal updatedPrice = current.multiply(multiplier).setScale(2, RoundingMode.HALF_UP);

                    holding.setCurrentPrice(updatedPrice);
                    holding.setChange24hPercent(Double.parseDouble(String.format("%.2f", deltaPct)));

                    // Update persistent SQLite database
                    com.portfolio.finance.db.DatabaseManager.getInstance()
                            .updateAssetPrice(holding.getSymbol(), updatedPrice, deltaPct);

                    if (onHoldingUpdated != null) {
                        onHoldingUpdated.accept(holding);
                    }
                }
            } catch (Exception e) {
                LOGGER.log(Level.SEVERE, "Failed refreshing asset holdings in SQLite: " + e.getMessage(), e);
            }
        }, workerPool);
    }

    private String getSimulatedFallbackPayload() {
        return "{\n" +
                "  \"timestamp\": \"" + java.time.Instant.now() + "\",\n" +
                "  \"feed\": \"NSE_BSE_SimulatedREST\",\n" +
                "  \"status\": 200,\n" +
                "  \"quotes\": [\n" +
                "    { \"symbol\": \"RELIANCE\", \"price\": 2995.50, \"changePercent\": \"+1.85%\", \"volume\": 3840200 },\n" +
                "    { \"symbol\": \"TCS\", \"price\": 4245.00, \"changePercent\": \"+1.15%\", \"volume\": 1210400 },\n" +
                "    { \"symbol\": \"INFY\", \"price\": 1860.00, \"changePercent\": \"+2.30%\", \"volume\": 4920100 },\n" +
                "    { \"symbol\": \"HDFCBANK\", \"price\": 1648.50, \"changePercent\": \"-0.45%\", \"volume\": 5120900 },\n" +
                "    { \"symbol\": \"NIFTYBEES\", \"price\": 284.20, \"changePercent\": \"+0.65%\", \"volume\": 8912300 }\n" +
                "  ]\n" +
                "}";
    }

    public void shutdown() {
        try {
            scheduler.shutdownNow();
            workerPool.shutdown();
            if (!workerPool.awaitTermination(2, TimeUnit.SECONDS)) {
                workerPool.shutdownNow();
            }
        } catch (InterruptedException e) {
            workerPool.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
}
