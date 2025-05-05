import express from 'express';
import { getDb } from '../db/schema';
import type { Order, OrderItem } from '../db/schema';

const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
    try {
        const db = await getDb();
        const orders = await db.all<Order[]>('SELECT * FROM orders ORDER BY createdAt DESC');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

// Get pending orders
router.get('/pending', async (req, res) => {
    try {
        const db = await getDb();
        const orders = await db.all<Order[]>('SELECT * FROM orders WHERE status = "pending" ORDER BY createdAt ASC');

        const ordersWithItems = await Promise.all(orders.map(async (order) => {
            const items = await db.all<OrderItem[]>(`
        SELECT oi.*, d.name, d.description 
        FROM order_items oi
        JOIN drinks d ON oi.drinkId = d.id
        WHERE oi.orderId = ?
      `, [order.id]);

            return { ...order, items };
        }));

        res.json(ordersWithItems);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

// Get order by customer name
router.get('/customer/:name', async (req, res) => {
    try {
        const db = await getDb();
        const order = await db.get<Order>(
            'SELECT * FROM orders WHERE customerName = ? AND status = "pending" ORDER BY createdAt DESC LIMIT 1',
            [req.params.name]
        );

        if (!order) {
            return res.status(404).json({ error: 'No pending order found for this customer' });
        }

        const items = await db.all(`
      SELECT oi.*, d.name, d.description 
      FROM order_items oi
      JOIN drinks d ON oi.drinkId = d.id
      WHERE oi.orderId = ?
    `, [order.id]);

        res.json({ ...order, items });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

// Create a new order
router.post('/', async (req, res) => {
    try {
        const { customerName, items } = req.body;
        const now = new Date().toISOString();

        // Check if customer already has a pending order
        const db = await getDb();
        const existingOrder = await db.get<Order>(
            'SELECT * FROM orders WHERE customerName = ? AND status = "pending"',
            [customerName]
        );

        if (existingOrder) {
            return res.status(400).json({ error: 'Customer already has a pending order' });
        }

        // Start a transaction
        await db.run('BEGIN TRANSACTION');

        try {
            // Create order
            const orderResult = await db.run(
                'INSERT INTO orders (customerName, status, createdAt, updatedAt) VALUES (?, ?, ?, ?)',
                [customerName, 'pending', now, now]
            );

            const orderId = orderResult.lastID;

            // Add order items
            for (const item of items) {
                await db.run(
                    'INSERT INTO order_items (orderId, drinkId, quantity) VALUES (?, ?, ?)',
                    [orderId, item.drinkId, item.quantity]
                );
            }

            await db.run('COMMIT');

            const order = await db.get<Order>('SELECT * FROM orders WHERE id = ?', [orderId]);
            res.status(201).json(order);
        } catch (err) {
            await db.run('ROLLBACK');
            throw err;
        }
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

// Mark order as completed
router.put('/:id/complete', async (req, res) => {
    try {
        const now = new Date().toISOString();

        const db = await getDb();
        await db.run(
            'UPDATE orders SET status = "completed", updatedAt = ? WHERE id = ?',
            ['completed', now, req.params.id]
        );

        const order = await db.get<Order>('SELECT * FROM orders WHERE id = ?', [req.params.id]);
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

export default router;