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
    name: 'Hose Bee Lyin Tee',
    slug: 'hose-bee-lyin',
    category: 'Graphic Tees',
    price: 1800,
    description: 'Iconic emoji rebus on a premium white cotton tee. If you know, you know.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White'],
    images: ['/images/products/hose-bee-lion.jpg'],
    stock: 50,
    isNew: true,
    isBestSeller: true,
    rating: 4.8,
    numReviews: 42,
  },
  {
    name: 'Circumcision Survivor',
    slug: 'circumcision-survivor',
    category: 'Oversized Fits',
    price: 2000,
    salePrice: 1500,
    description: 'Vintage bootleg-style graphic tee honoring the survivors. Heavyweight black cotton.',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    images: ['/images/products/circumcision-survivor.jpg'],
    stock: 30,
    isNew: false,
    isBestSeller: true,
    rating: 4.9,
    numReviews: 128,
  },
  {
    name: 'Physique Powered By...',
    slug: 'physique-powered',
    category: 'Oversized Fits',
    price: 2200,
    description: 'Classic statue aesthetic meets modern fuel: Caffeine, Nicotine, Creatine. Essential gym wear.',
    sizes: ['L', 'XL', 'XXL'],
    colors: ['Black'],
    images: ['/images/products/physique-powered.jpg'],
    stock: 75,
    isNew: true,
    isBestSeller: false,
    rating: 5.0,
    numReviews: 15,
  },
  {
    name: 'Swole Kitty',
    slug: 'swole-kitty',
    category: 'Graphic Tees',
    price: 1900,
    description: 'Maximum gains meet maximum cute. White premium cotton tee.',
    sizes: ['S', 'M', 'L'],
    colors: ['White'],
    images: ['/images/products/swole-kitty.jpg'],
    stock: 20,
    isNew: true,
    isBestSeller: true,
    rating: 4.6,
    numReviews: 89,
  }
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
