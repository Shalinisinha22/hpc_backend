import mongoose from 'mongoose';

const MONGODB_URI =  'mongodb+srv://ssshivani017:<db_password>@cluster0.ozwextf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let isConnected = false;

async function connectDB() {
  if (isConnected) {
    return;
  }
  await mongoose.connect(MONGODB_URI);
  isConnected = true;
}

export default connectDB;