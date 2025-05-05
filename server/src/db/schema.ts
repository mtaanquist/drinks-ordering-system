// server/src/db/schema.ts

import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

// Define types for our database models
export interface Drink {
    id: number;
    name: string;
    description: string;
    recipe: string;
    imageUrl: string | null;
    inStock: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Order {
    id: number;
    customerName: string;
    status: 'pending' | 'completed';
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    id: number;
    orderId: number;
    drinkId: number;
    quantity: number;
}

// Initialize database
export async function initializeDatabase(): Promise<Database> {
    const db = await open({
        filename: path.resolve(__dirname, '../../drinks.db'),
        driver: sqlite3.Database
    });

    // Create tables if they don't exist
    await db.exec(`
    CREATE TABLE IF NOT EXISTS drinks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      recipe TEXT NOT NULL,
      imageUrl TEXT,
      inStock BOOLEAN NOT NULL DEFAULT 1,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customerName TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId INTEGER NOT NULL,
      drinkId INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (orderId) REFERENCES orders (id),
      FOREIGN KEY (drinkId) REFERENCES drinks (id)
    );
  `);

    return db;
}

// Database singleton
let dbInstance: Database | null = null;

export async function getDb(): Promise<Database> {
    if (!dbInstance) {
        dbInstance = await initializeDatabase();
    }
    return dbInstance;
}