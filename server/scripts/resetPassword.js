import { MongoClient } from 'mongodb';
import crypto from 'crypto';
import dotenv from 'dotenv';

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

async function resetPassword() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);

    // Yeni güçlü şifre oluştur
    const newPassword = generateStrongPassword();

    // Şifreyi güncelle veya oluştur
    await db.collection('settings').updateOne(
      { key: 'admin_password' },
      {
        $set: {
          key: 'admin_password',
          value: newPassword,
          updated_at: new Date()
        }
      },
      { upsert: true }
    );

    console.log('');
    console.log('🔐 ════════════════════════════════════════════════════');
    console.log('🔐 ADMIN ŞİFRESİ BAŞARIYLA SIFIRLANDI!');
    console.log('🔐 ════════════════════════════════════════════════════');
    console.log(`🔐 Yeni Şifre: ${newPassword}`);
    console.log('🔐 ════════════════════════════════════════════════════');
    console.log('🔐 Bu şifreyi güvenli bir yere kaydedin!');
    console.log('🔐 Admin paneline erişim: http://localhost:5173/#/nz-ctrl-x9k2m');
    console.log('🔐 ════════════════════════════════════════════════════');
    console.log('');

  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await client.close();
  }
}

resetPassword();
