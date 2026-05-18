import { Router } from 'express';
import { getOrders, addOrder, updateOrderStatus } from './order.controller';

const router = Router();

router.get('/', getOrders);
router.post('/', addOrder);
router.patch('/:id/status', updateOrderStatus);

export const orderRoutes = router;
