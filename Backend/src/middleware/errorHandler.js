export const errorHandler = (err, req, res, next) => {
  console.error('错误处理中间件捕获异常:', err);
  
  const errorResponse = {
    success: false,
    message: err.message || '服务器内部错误',
    code: err.code || 500,
    timestamp: new Date().toISOString(),
    path: req.path
  };

  if (err.code === 400) {
    res.status(400).json(errorResponse);
  } else if (err.code === 401) {
    res.status(401).json(errorResponse);
  } else if (err.code === 403) {
    res.status(403).json(errorResponse);
  } else if (err.code === 404) {
    res.status(404).json(errorResponse);
  } else if (err.code === 429) {
    res.status(429).json(errorResponse);
  } else {
    res.status(500).json(errorResponse);
  }
};

export const AppError = class extends Error {
  constructor(message, code = 500) {
    super(message);
    this.code = code;
    this.name = 'AppError';
  }
};

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(new AppError(error.details[0].message, 400));
    } else {
      next();
    }
  };
};