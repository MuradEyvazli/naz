import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import crypto from 'crypto';

dotenv.config();

const generateStrongPassword = () => {
  const length = 24;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    password += charset[randomBytes[i] % charset.length];
  }
  return password;
};

const resetPassword = async () => {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || 'naz_dunyasi77';

  if (!uri) {
    console.error('❌ MONGODB_URI environment variable gerekli!');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);

    const newPassword = generateStrongPassword();

    await db.collection('settings').updateOne(
      { key: 'admin_password' },
      { $set: { key: 'admin_password', value: newPassword, updated_at: new Date() } },
      { upsert: true }
    );

    console.log('');
    console.log('🔐 ════════════════════════════════════════');
    console.log('🔐 ADMIN ŞİFRESİ SIFIRLANDI!');
    console.log(`🔐 Yeni Şifre: ${newPassword}`);
    console.log('🔐 Bu şifreyi güvenli bir yere kaydedin!');
    console.log('🔐 ════════════════════════════════════════');
    console.log('');

  } catch (error) {
    console.error('❌ Hata:', error.message);
  } finally {
    await client.close();
  }
};

resetPassword();
