import app from './server.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 5000;

mongoose.connect(process.env.ITVIEC_DB_URI)
.then(() => {
  console.log('MongoDB connected');
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});