import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdminUser = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kartela';
    await mongoose.connect(mongoURI);

    console.log('✅ MongoDB bağlantısı başarılı');

    // Admin kullanıcısı var mı kontrol et
    const existingAdmin = await User.findOne({ username: 'admin' });

    if (existingAdmin) {
      console.log('⚠️  Admin kullanıcısı zaten mevcut');
      process.exit(0);
    }

    // Yeni admin kullanıcısı oluştur
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminUser = new User({
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
    });

    await adminUser.save();

    console.log('✅ Admin kullanıcısı oluşturuldu');
    console.log('Kullanıcı adı: admin');
    console.log('Şifre: admin123');
    console.log('⚠️  UYARI: Şifreyi mutlaka değiştirin!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
};

createAdminUser();
