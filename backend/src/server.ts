import express from 'express';
import cors from 'cors';
import orderRoutes from './routes/order.routes';

const app = express();

app.use(cors({
  origin: "*", // Ye filhal sabko allow kar dega (Testing ke liye best hai)
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Alhamdulillah! Backend is live and running.');
});

// API Routes
app.use('/api', orderRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;// Testing ke liye export
