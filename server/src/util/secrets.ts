import logger from './logger';
import dotenv from 'dotenv';
import fs from 'fs';

if (fs.existsSync('.env')) {
    logger.debug('Using .env file to supply config environment variables');
    dotenv.config({ path: '.env' });
} else {
    logger.debug('Using .env.example file to supply config environment variables');
    dotenv.config({ path: '.env.example' });  // you can delete this after you create your own .env file!
}
export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === 'production'; // Anything else is treated as 'dev'

export const JWT_SECRET = process.env['JWT_SECRET'];
export const MONGODB_URI = prod ? process.env['MONGODB_URI'] : process.env['MONGODB_URI_LOCAL'];

export const TypeOfCard = ['info', 'poll', 'order'];
export const ServerURL = process.env['SERVERURL'];
export const ClientURL = process.env['CLIENTURL'];

export const SLACK_TOKEN = process.env['SLACK_TOKEN'];
export const SLACK_CLIENT_ID = process.env['SLACK_CLIENT_ID'];
export const SLACK_CLIENT_SECRET = process.env['SLACK_CLIENT_SECRET'];

if (!JWT_SECRET) {
    logger.error('No JWT secret. Set JWT_SECRET environment variable.');
    process.exit(1);
}

if (!MONGODB_URI) {
    if (prod) {
        logger.error('No mongo connection string. Set MONGODB_URI environment variable.');
    } else {
        logger.error('No mongo connection string. Set MONGODB_URI_LOCAL environment variable.');
    }
    process.exit(1);
}
