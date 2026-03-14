import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().default(3001),
  FRONTEND_URL: Joi.string().default('http://localhost:3000'),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().default('postgres'),
  DB_PASSWORD: Joi.string().default('postgres'),
  DB_NAME: Joi.string().default('drive_app'),
  DB_SYNC: Joi.boolean().truthy('true').falsy('false').default(true),
  JWT_SECRET: Joi.string().min(16).default('drive-app-development-secret'),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  AWS_REGION: Joi.string().default('us-east-1'),
  AWS_S3_BUCKET: Joi.string().default('drive-app-dev'),
  AWS_ACCESS_KEY_ID: Joi.string().default('test'),
  AWS_SECRET_ACCESS_KEY: Joi.string().default('test'),
  AWS_S3_ENDPOINT: Joi.string().allow('').optional().default(''),
  AWS_S3_PUBLIC_ENDPOINT: Joi.string().allow('').optional().default(''),
  AWS_S3_FORCE_PATH_STYLE: Joi.boolean()
    .truthy('true')
    .falsy('false')
    .default(false),
  S3_PRESIGNED_URL_EXPIRES_IN: Joi.number().integer().min(60).max(3600).default(900),
});
