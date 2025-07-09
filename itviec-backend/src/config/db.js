import mongoose from 'mongoose'
import dotenv from 'dotenv';

dotenv.config(); // Load các biến môi trường từ .env

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.ITVIEC_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Kết nối thành công');
  } catch (error) {
    console.error('Lỗi kết nối:', error);
    process.exit(1); 
  }
};

export default connectDB;