import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'naz_astroloji';

let db = null;
let client = null;

export const connectDB = async () => {
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);

    // Create indexes
    await db.collection('blogs').createIndex({ created_at: -1 });
    await db.collection('blogs').createIndex({ published: 1 });

    console.log('✅ MongoDB bağlantısı başarılı!');
    console.log(`📦 Database: ${DB_NAME}`);

    return db;
  } catch (error) {
    console.error('❌ MongoDB bağlantı hatası:', error.message);
    process.exit(1);
  }
};

export const getDB = () => {
  if (!db) {
    throw new Error('Database bağlantısı yok! Önce connectDB() çağırın.');
  }
  return db;
};

export const closeDB = async () => {
  if (client) {
    await client.close();
    console.log('MongoDB bağlantısı kapatıldı.');
  }
};
