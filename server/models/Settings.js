import { getDB } from '../config/db.js';
import crypto from 'crypto';

const COLLECTION = 'settings';

// Güçlü rastgele şifre oluştur
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

// Admin şifresini getir
export const getAdminPassword = async () => {
  const db = getDB();
  const setting = await db.collection(COLLECTION).findOne({ key: 'admin_password' });
  return setting?.value || null;
};

// Admin şifresini güncelle
export const setAdminPassword = async (password) => {
  const db = getDB();
  await db.collection(COLLECTION).updateOne(
    { key: 'admin_password' },
    { $set: { key: 'admin_password', value: password, updated_at: new Date() } },
    { upsert: true }
  );
};

// Ayar getir
export const getSetting = async (key) => {
  const db = getDB();
  const setting = await db.collection(COLLECTION).findOne({ key });
  return setting?.value || null;
};

// Ayar kaydet
export const setSetting = async (key, value) => {
  const db = getDB();
  await db.collection(COLLECTION).updateOne(
    { key },
    { $set: { key, value, updated_at: new Date() } },
    { upsert: true }
  );
};

// Varsayılan ayarları oluştur
export const initializeSettings = async () => {
  const db = getDB();
  const adminPassword = await db.collection(COLLECTION).findOne({ key: 'admin_password' });

  if (!adminPassword) {
    // Güçlü rastgele şifre oluştur
    const strongPassword = generateStrongPassword();
    await db.collection(COLLECTION).insertOne({
      key: 'admin_password',
      value: strongPassword,
      created_at: new Date()
    });
    console.log('');
    console.log('🔐 ════════════════════════════════════════');
    console.log('🔐 YENİ ADMIN ŞİFRESİ OLUŞTURULDU!');
    console.log(`🔐 Şifre: ${strongPassword}`);
    console.log('🔐 Bu şifreyi güvenli bir yere kaydedin!');
    console.log('🔐 ════════════════════════════════════════');
    console.log('');
  }
};

// Şifreyi sıfırla (yeni güçlü şifre oluştur)
export const resetAdminPassword = async () => {
  const strongPassword = generateStrongPassword();
  await setAdminPassword(strongPassword);
  return strongPassword;
};
