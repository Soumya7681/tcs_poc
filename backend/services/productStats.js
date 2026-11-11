import Product, { SALES_FIELDS } from '../models/Product.js';

export const getProductStats = async () => {
  const group = Object.fromEntries(SALES_FIELDS.map((field) => [field, { $avg: `$${field}` }]));
  const [result] = await Product.aggregate([{ $group: { _id: null, total: { $sum: 1 }, ...group } }]);
  const averages = Object.fromEntries(
    SALES_FIELDS.map((field) => [field, result ? Number(result[field].toFixed(2)) : 0])
  );
  return { total: result?.total || 0, averages };
};
