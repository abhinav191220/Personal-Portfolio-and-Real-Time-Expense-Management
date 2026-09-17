package com.portfolio.finance;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.image.Image;
import javafx.stage.Stage;

import java.io.IOException;
import java.util.Objects;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Main application launcher for Personal Portfolio & Real-Time Expense Management Desktop Platform.
 * Bootstraps JavaFX 21+ lifecycle, sets up the primary stage, and initializes database connection pool.
 */
public class MainApp extends Application {

    private static final Logger LOGGER = Logger.getLogger(MainApp.class.getName());
    public static final String APP_TITLE = "Personal Portfolio & Real-Time Expense Management";
    public static final double MIN_WIDTH = 1200.0;
    public static final double MIN_HEIGHT = 800.0;

    @Override
    public void init() throws Exception {
        super.init();
        LOGGER.info("Initializing database connection pool and SQLite tables...");
        try {
            com.portfolio.finance.db.DatabaseManager.getInstance().initializeDatabase();
            LOGGER.info("Database initialized successfully.");
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Failed to initialize database: " + e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public void start(Stage primaryStage) {
        try {
            LOGGER.info("Loading main dashboard FXML view...");
            Parent root = FXMLLoader.load(Objects.requireNonNull(getClass().getResource("/com/portfolio/finance/view/DashboardView.fxml")));

            Scene scene = new Scene(root, MIN_WIDTH, MIN_HEIGHT);
            scene.getStylesheets().add(Objects.requireNonNull(getClass().getResource("/com/portfolio/finance/css/application.css")).toExternalForm());

            primaryStage.setTitle(APP_TITLE);
            primaryStage.setScene(scene);
            primaryStage.setMinWidth(MIN_WIDTH);
            primaryStage.setMinHeight(MIN_HEIGHT);

            primaryStage.setOnCloseRequest(event -> {
                LOGGER.info("Shutting down application background executor threads...");
                com.portfolio.finance.service.MarketDataService.getInstance().shutdown();
                com.portfolio.finance.db.DatabaseManager.getInstance().closePool();
            });

            primaryStage.show();
            LOGGER.info("Application interface loaded and displayed successfully.");
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "Error loading UI layout: " + e.getMessage(), e);
        }
    }

    @Override
    public void stop() throws Exception {
        super.stop();
        LOGGER.info("Application lifecycle terminated.");
    }

    public static void main(String[] args) {
        LOGGER.info("Starting Personal Portfolio & Real-Time Expense Management Desktop App...");
        launch(args);
    }
}
