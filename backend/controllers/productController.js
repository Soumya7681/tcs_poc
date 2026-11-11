import Product from '../models/Product.js';
import { getProductStats } from '../services/productStats.js';

const FIELDS = ['name', 'category', 'price', 'salesImpacted', 'averageSales', 'notSold'];

const pick = (body) =>
  Object.fromEntries(FIELDS.filter((field) => body[field] !== undefined).map((field) => [field, body[field]]));

export const getProducts = async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
};

export const getStats = async (req, res) => {
  res.json(await getProductStats());
};

export const createProduct = async (req, res) => {
  const product = await Product.create({ ...pick(req.body), createdBy: req.user._id });
  res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  product.set(pick(req.body));
  res.json(await product.save());
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ id: product._id });
};
