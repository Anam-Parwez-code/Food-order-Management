import { Router } from 'express';
import { getMenu, placeOrder, getOrderStatus } from '../controllers/order.controller';

const router = Router();

router.get('/menu', getMenu);
router.post('/orders', placeOrder);
router.get('/orders/:id', getOrderStatus);

export default router;