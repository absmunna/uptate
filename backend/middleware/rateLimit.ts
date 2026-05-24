import rateLimit from 'express-rate-limit';

export const rateLimitMiddleware = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: process.env.NODE_ENV === 'development' ? 10000 : 100,
  message: 'Too many requests, please try again after a minute',
  skip: (req) => process.env.NODE_ENV === 'development' && !req.path.startsWith('/api/'),
});
