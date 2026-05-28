import { Router } from 'express';
import { login, register, forgotPassword, getMe } from './auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/me', getMe);

export const authRoutes = router;
