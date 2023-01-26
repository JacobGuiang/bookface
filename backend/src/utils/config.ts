import * as dotenv from 'dotenv';
const result = dotenv.config();

if (result.error) {
  throw result.error;
}

if (!process.env.NODE_ENV) {
  throw new Error('NODE_ENV not found in process.env');
}

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI not found in process.env');
}

if (!process.env.TEST_MONGODB_URI) {
  throw new Error('MONGODB_TEST_URI not found in process.env');
}

if (!process.env.PORT) {
  throw new Error('PORT not found in process.env');
}

if (!process.env.JWT_SECRET_KEY) {
  throw new Error('JWT_SECRET_KEY not found in process.env');
}

const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;
const PORT = Number(process.env.PORT);
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export default { MONGODB_URI, PORT, JWT_SECRET_KEY };
