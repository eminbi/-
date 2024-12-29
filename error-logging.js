// utils/logger.js
const winston = require('winston');
const { createLogger, format, transports } = winston;

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'research-management' },
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));
}

// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  logger.error('Error:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params
  });

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: err.details
    });
  }

  if (err.name === 'AuthenticationError') {
    return res.status(401).json({
      success: false,
      error: 'Authentication Error'
    });
  }

  return res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
};

// utils/validation.js
const Joi = require('joi');

const schemas = {
  researchItem: Joi.object({
    title: Joi.string().required(),
    authors: Joi.string().required(),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear()),
    type: Joi.string().valid('Book', 'Paper', 'Journal', 'Other').required(),
    summary: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional()
  }),

  presentation: Joi.object({
    researchId: Joi.string().required(),
    template: Joi.string().optional(),
    includeAI: Joi.boolean().default(true)
  })
};

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      throw {
        name: 'ValidationError',
        details: error.details
      };
    }
    next();
  };
};
