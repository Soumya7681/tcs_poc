import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Product from './models/Product.js';

const products = [
  { name: 'Wireless Mouse', category: 'Electronics', price: 799, salesImpacted: 15, averageSales: 60, notSold: 25 },
  { name: 'Mechanical Keyboard', category: 'Electronics', price: 3499, salesImpacted: 45, averageSales: 35, notSold: 20 },
  { name: 'USB-C Hub', category: 'Electronics', price: 1999, salesImpacted: 10, averageSales: 20, notSold: 70 },
  { name: 'Office Chair', category: 'Furniture', price: 8999, salesImpacted: 20, averageSales: 55, notSold: 25 },
  { name: 'Standing Desk', category: 'Furniture', price: 15999, salesImpacted: 50, averageSales: 30, notSold: 20 },
  { name: 'Desk Lamp', category: 'Furniture', price: 1299, salesImpacted: 5, averageSales: 75, notSold: 20 },
  { name: 'Notebook Pack', category: 'Stationery', price: 249, salesImpacted: 10, averageSales: 25, notSold: 65 },
  { name: 'Gel Pens', category: 'Stationery', price: 149, salesImpacted: 12, averageSales: 68, notSold: 20 },
  { name: 'Water Bottle', category: 'Lifestyle', price: 599, salesImpacted: 40, averageSales: 40, notSold: 20 },
  { name: 'Backpack', category: 'Lifestyle', price: 2499, salesImpacted: 18, averageSales: 62, notSold: 20 },
];

const run = async () => {
  await connectDB();
  await Promise.all([User.deleteMany({}), Product.deleteMany({})]);
  const admin = await User.create({ name: 'Admin', email: 'admin@example.com', password: 'admin123' });
  await Product.create(products.map((p) => ({ ...p, createdBy: admin._id })));
  console.log('Seeded user admin@example.com / admin123 and', products.length, 'products');
  await mongoose.disconnect();
};

run().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
