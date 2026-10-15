/**
 * Slot 3.3 - connecting Node.js to MongoDB with the OFFICIAL driver.
 * One MongoClient per application, reused by every request (connection pooling).
 */
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.DB_NAME || 'booknest';

const client = new MongoClient(uri);
let db = null;

async function connectDB() {
  if (db) return db;
  await client.connect();
  db = client.db(dbName);
  console.log(`MongoDB connected: ${uri}/${dbName}`);
  return db;
}

const getDB = () => {
  if (!db) throw new Error('Database not connected. Call connectDB() first.');
  return db;
};

const closeDB = async () => { await client.close(); db = null; };

module.exports = { connectDB, getDB, closeDB, client };
