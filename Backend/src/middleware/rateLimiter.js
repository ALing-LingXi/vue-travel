import rateLimit from 'express-rate-limit';
import { AppError } from './errorHandler.js';

export const createRateLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: '请求过于频繁，请稍后再试',
      code: 429
    }
  };

  return rateLimit({ ...defaultOptions, ...options });
};

export const travelApiLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: '旅游API请求过于频繁，请稍后再试',
    code: 429
  }
});

export const chatApiLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: '聊天请求过于频繁，请稍后再试',
    code: 429
  }
});

export const globalLimiter = createRateLimiter();
export const apiLimiter = globalLimiter;