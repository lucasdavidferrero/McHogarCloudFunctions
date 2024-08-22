import dotenv from 'dotenv';
import * as functions from 'firebase-functions';

// Load the correct .env file based on the environment
const environment = functions.config().app.environment || 'development';
dotenv.config({ path: `.env.${environment}`, debug: environment !== 'production' });

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