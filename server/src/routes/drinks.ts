import express from 'express';
import { getDb } from '../db/schema';
import type { Drink } from '../db/schema';

const router = express.Router();

// Get all drinks
router.get('/', async (req, res) => {
    try {
        const db = await getDb();
        const drinks = await db.all<Drink[]>('SELECT * FROM drinks');
        res.json(drinks);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

// Get a single drink
router.get('/:id', async (req, res) => {
    try {
        const db = await getDb();
        const drink = await db.get<Drink>('SELECT * FROM drinks WHERE id = ?', [req.params.id]);

        if (!drink) {
            return res.status(404).json({ error: 'Drink not found' });
        }

        res.json(drink);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

// Create a new drink
router.post('/', async (req, res) => {
    try {
        const { name, description, recipe, imageUrl } = req.body;
        const now = new Date().toISOString();

        const db = await getDb();
        const result = await db.run(
            'INSERT INTO drinks (name, description, recipe, imageUrl, inStock, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, description, recipe, imageUrl, true, now, now]
        );

        const drink = await db.get<Drink>('SELECT * FROM drinks WHERE id = ?', [result.lastID]);
        res.status(201).json(drink);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

// Update a drink
router.put('/:id', async (req, res) => {
    try {
        const { name, description, recipe, imageUrl, inStock } = req.body;
        const now = new Date().toISOString();

        const db = await getDb();
        await db.run(
            'UPDATE drinks SET name = ?, description = ?, recipe = ?, imageUrl = ?, inStock = ?, updatedAt = ? WHERE id = ?',
            [name, description, recipe, imageUrl, inStock, now, req.params.id]
        );

        const drink = await db.get<Drink>('SELECT * FROM drinks WHERE id = ?', [req.params.id]);
        res.json(drink);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

// Delete a drink
router.delete('/:id', async (req, res) => {
    try {
        const db = await getDb();
        await db.run('DELETE FROM drinks WHERE id = ?', [req.params.id]);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

export default router;