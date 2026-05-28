import { Router } from 'express';
import { initiatePayment, verifyPayment } from './payment.controller';
import { requireAuth } from '../../middleware/auth';
import { requirePermission } from '../../middleware/permission';

const router = Router();

router.post('/initiate', requireAuth, requirePermission("CAN_PURCHASE"), initiatePayment);
router.post('/verify', requireAuth, requirePermission("CAN_PURCHASE"), verifyPayment);

export const paymentRoutes = router;
