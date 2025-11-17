/**
 * Module to handle SQLite database connection and initialization
 */

import sqlite3 from "sqlite3";
import config from "./config";

sqlite3.verbose();

// Function to initialize the database
function initializeDatabase() {
  const db = new sqlite3.Database(config.dbFile, (err) => {
    if (err) {
      console.error("Error connecting to SQLite database:", err.message);
    } else {
      console.log("Connected to SQLite database:", config.dbFile);
      // Create a table for storing webhooks if it doesn't exist
      db.run(
        `CREATE TABLE IF NOT EXISTS webhooks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id TEXT,
            instance_id TEXT,
            integration_name TEXT,
            flow_name TEXT,
            webhook_url TEXT,
            enabled INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`,
        (err) => {
          if (err) {
            console.error("Error creating webhooks table:", err.message);
          } else {
            console.log("Webhooks table ensured.");
          }
        },
      );
    }
  });
  return db;
}

export default initializeDatabase();
