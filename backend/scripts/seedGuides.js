import mongoose from 'mongoose';
import User from '../models/User.js';

mongoose.connect('mongodb://127.0.0.1:27017/tour')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const guides = [
  {
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    password: 'password123',
    role: 'guide',
    isApproved: true,
    city: 'Jaipur',
    state: 'Rajasthan',
    languages: ['English', 'Hindi', 'French'],
    specialties: ['History', 'Architecture', 'Photography'],
    rating: 4.8,
    reviews: 124,
    price: 2500,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400'
  },
  {
    name: 'Meera Patel',
    email: 'meera.patel@example.com',
    password: 'password123',
    role: 'guide',
    isApproved: true,
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    languages: ['English', 'Hindi', 'Gujarati'],
    specialties: ['Culture', 'Spirituality', 'Food'],
    rating: 4.9,
    reviews: 89,
    price: 2000,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400'
  },
  {
    name: 'Tenzin Gyatso',
    email: 'tenzin.gyatso@example.com',
    password: 'password123',
    role: 'guide',
    isApproved: true,
    city: 'Leh',
    state: 'Ladakh',
    languages: ['English', 'Hindi', 'Tibetan'],
    specialties: ['Trekking', 'Buddhism', 'Nature'],
    rating: 5.0,
    reviews: 210,
    price: 3500,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'
  }
];

const seedGuides = async () => {
  try {
    await User.deleteMany({ role: 'guide' });
    for (const guide of guides) {
      const g = new User(guide);
      await g.save();
    }
    console.log('Guides seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding guides:', error);
    process.exit(1);
  }
};

seedGuides();
