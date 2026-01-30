import express from 'express';
import cors from 'cors';
import orderRoutes from './routes/order.routes';

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', orderRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;// Testing ke liye export
