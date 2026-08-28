import 'dotenv/config';
import mongoose from 'mongoose';

// ─── Inline Models (avoid Next.js module resolution in a plain script) ──────

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  role: { type: String, default: 'customer' },
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name: String,
  slug: { type: String, unique: true },
  category: String,
  price: Number,
  salePrice: Number,
  description: String,
  sizes: [String],
  colors: [String],
  images: [String],
  stock: { type: Number, default: 200 },
  isNew: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

// ─── Seed Data ────────────────────────────────────────────────────────────────

const USERS = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@threadanomaly.com',
    phone: '9000000001',
    // bcrypt hash of "admin123"
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'admin',
  },
  {
    firstName: 'Test',
    lastName: 'Customer',
    email: 'customer@threadanomaly.com',
    phone: '9000000002',
    // bcrypt hash of "customer123"
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'customer',
  },
];

const PRODUCTS = [
  {
    name: 'static',
    slug: 'static',
    category: 'Graphic Tees',
    price: 999,
    description: 'Pure white noise graphic on heavyweight 240GSM cotton. A statement in distortion.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White'],
    images: ['/images/placeholder.svg'],
    stock: 180,
    isNew: true,
    isBestSeller: false,
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: 'feedback loop',
    slug: 'feedback-loop',
    category: 'Oversized Fits',
    price: 1299,
    salePrice: 999,
    description: 'Endless repetition. Drop-shoulder oversized boxy fit with looping audio-wave print.',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Electric Green'],
    images: ['/images/placeholder.svg'],
    stock: 150,
    isNew: false,
    isBestSeller: true,
    rating: 4.8,
    numReviews: 34,
  },
  {
    name: 'off-grid',
    slug: 'off-grid',
    category: 'Graphic Tees',
    price: 899,
    description: 'Disconnected and untraceable. Minimal glitch logo placement on left chest.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    images: ['/images/placeholder.svg'],
    stock: 200,
    isNew: false,
    isBestSeller: false,
    rating: 4.2,
    numReviews: 8,
  },
  {
    name: 'corrupted',
    slug: 'corrupted',
    category: 'Limited Drops',
    price: 1199,
    description: 'File not found. Destroyed-hem detailing on premium long-staple cotton.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White'],
    images: ['/images/placeholder.svg'],
    stock: 60,
    isNew: false,
    isBestSeller: true,
    rating: 4.9,
    numReviews: 22,
  },
  {
    name: 'bassline',
    slug: 'bassline',
    category: 'Music Collab Series',
    price: 1299,
    description: 'Feel it in your chest. Full-back low-frequency waveform on heavyweight cotton.',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    images: ['/images/placeholder.svg'],
    stock: 120,
    isNew: false,
    isBestSeller: false,
    rating: 4.6,
    numReviews: 15,
  },
  {
    name: 'anomaly 01',
    slug: 'anomaly-01',
    category: 'Limited Drops',
    price: 1499,
    description: 'The first irregularity in the system. Strictly limited to 100 pieces — no reprints.',
    sizes: ['M', 'L', 'XL'],
    colors: ['Electric Green'],
    images: ['/images/placeholder.svg'],
    stock: 100,
    isNew: true,
    isBestSeller: false,
    rating: 5.0,
    numReviews: 6,
  },
  {
    name: 'distortion tee',
    slug: 'distortion-tee',
    category: 'Oversized Fits',
    price: 1199,
    description: 'Warped grid patterns on a relaxed boxy fit. Maximum signal, minimum fuss.',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Yellow'],
    images: ['/images/placeholder.svg'],
    stock: 170,
    isNew: false,
    isBestSeller: false,
    rating: 4.3,
    numReviews: 11,
  },
  {
    name: 'glitchcore',
    slug: 'glitchcore',
    category: 'Graphic Tees',
    price: 999,
    description: 'For the system errors. RGB-split logo across the entire front panel.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    images: ['/images/placeholder.svg'],
    stock: 200,
    isNew: true,
    isBestSeller: true,
    rating: 4.7,
    numReviews: 28,
  },
  {
    name: 'frequency',
    slug: 'frequency',
    category: 'Music Collab Series',
    price: 1399,
    description: 'Tune in, drop out. Sound-frequency ring print on premium ringspun cotton.',
    sizes: ['M', 'L', 'XL'],
    colors: ['Black', 'Electric Green'],
    images: ['/images/placeholder.svg'],
    stock: 85,
    isNew: true,
    isBestSeller: false,
    rating: 4.4,
    numReviews: 9,
  },
  {
    name: 'midnight signal',
    slug: 'midnight-signal',
    category: 'Limited Drops',
    price: 1499,
    description: 'Only broadcast after dark. Reflective 3M print activates under flash/UV light.',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    images: ['/images/placeholder.svg'],
    stock: 75,
    isNew: false,
    isBestSeller: true,
    rating: 4.9,
    numReviews: 41,
  },
  {
    name: 'broadcast',
    slug: 'broadcast',
    category: 'Music Collab Series',
    price: 1499,
    description: 'High decibels. Part of the underground radio collaboration series.',
    sizes: ['M', 'L', 'XL'],
    colors: ['Black', 'Yellow'],
    images: ['/images/placeholder.svg'],
    stock: 110,
    isNew: true,
    isBestSeller: false,
    rating: 4.5,
    numReviews: 17,
  },
  {
    name: 'static bloom',
    slug: 'static-bloom',
    category: 'Graphic Tees',
    price: 1099,
    salePrice: 899,
    description: 'Digital flora. Screen-printed with puff ink that adds a raised 3D texture.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White'],
    images: ['/images/placeholder.svg'],
    stock: 160,
    isNew: false,
    isBestSeller: true,
    rating: 4.6,
    numReviews: 31,
  },
];

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/thread-anomaly';
  console.log(`\n🔗 Connecting to MongoDB: ${uri}\n`);

  await mongoose.connect(uri);
  console.log('✅ Connected.\n');

  // Clear existing data
  await User.deleteMany({});
  await Product.deleteMany({});
  console.log('🗑️  Cleared existing users and products.\n');

  // Seed users
  await User.insertMany(USERS);
  console.log(`👤 Seeded ${USERS.length} users:`);
  console.log('   admin@threadanomaly.com    / password: admin123    (role: admin)');
  console.log('   customer@threadanomaly.com / password: customer123 (role: customer)\n');

  // Seed products
  await Product.insertMany(PRODUCTS);
  console.log(`👕 Seeded ${PRODUCTS.length} products.\n`);

  console.log('🎉 Database seeded successfully!\n');
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
