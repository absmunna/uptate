import { Router } from 'express';
import { login, register, forgotPassword } from './auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

export const authRoutes = router;
