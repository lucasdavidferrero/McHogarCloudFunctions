import dotenv from 'dotenv';
type ENV_TYPE = 'development' | 'preview' | 'production'

// Load the correct .env file based on the environment

export const CURRENT_ENVIROMENT = process.env.NODE_ENV as ENV_TYPE || 'development';
dotenv.config({ path: `.env.${CURRENT_ENVIROMENT}`, debug: CURRENT_ENVIROMENT !== 'production' });

export const FIRE_API_KEY = process.env.FIRE_API_KEY || '';
export const FIRE_AUTH_DOMAIN = process.env.FIRE_AUTH_DOMAIN || '';
export const FIRE_PROJECT_ID = process.env.FIRE_PROJECT_ID || '';
export const FIRE_STORAGE_BUCKET = process.env.FIRE_STORAGE_BUCKET || '';
export const FIRE_MESSAGING_SENDER_ID = process.env.FIRE_MESSAGING_SENDER_ID || '';
export const FIRE_APP_ID = process.env.FIRE_APP_ID || '';
export const FIRE_MEASUREMENT_ID = process.env.FIRE_MEASUREMENT_ID || '';
export const GOOGLE_APPLICATION_CREDENTIALS_JSON_FILENAME = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON_FILENAME || '';

export const DATABASE_URL = process.env.DATABASE_URL || '';

export default process.env;