import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './db/schema';
import drinkRoutes from './routes/drinks';
import orderRoutes from './routes/orders';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initializeDatabase().then(() => {
    console.log('Database initialized successfully');
}).catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});

// Routes
app.use('/api/drinks', drinkRoutes);
app.use('/api/orders', orderRoutes);

// Static files (if needed for images)
app.use('/uploads', express.static('uploads'));

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});