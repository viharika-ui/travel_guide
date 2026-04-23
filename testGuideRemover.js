import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import guideModel from './backend/models/guideModel.js';
import User from './backend/models/User.js';

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  await guideModel.deleteMany({ name: { $regex: /Test/i } });
  await User.deleteMany({ name: { $regex: /Test/i } });
  console.log('Test guides/users removed');
  process.exit();
}
run();
