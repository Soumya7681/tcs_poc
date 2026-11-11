import Product from '../../models/Product.js';
import { getProductStats } from '../../services/productStats.js';
import { notFound, requireUser, toGraphQLError } from '../errors.js';

const definedOnly = (input) =>
  Object.fromEntries(Object.entries(input).filter(([, value]) => value !== null && value !== undefined));

export const productResolvers = {
  Query: {
    products: (_, __, context) => {
      requireUser(context);
      return Product.find().sort({ createdAt: -1 }).exec();
    },
    productStats: (_, __, context) => {
      requireUser(context);
      return getProductStats();
    },
  },
  Mutation: {
    createProduct: async (_, { input }, context) => {
      const user = requireUser(context);
      try {
        return await Product.create({ ...input, createdBy: user._id });
      } catch (err) {
        throw toGraphQLError(err);
      }
    },
    updateProduct: async (_, { id, input }, context) => {
      requireUser(context);
      try {
        const product = await Product.findById(id);
        if (!product) throw notFound('Product not found');
        product.set(definedOnly(input));
        return await product.save();
      } catch (err) {
        throw toGraphQLError(err);
      }
    },
    deleteProduct: async (_, { id }, context) => {
      requireUser(context);
      try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) throw notFound('Product not found');
        return product._id.toString();
      } catch (err) {
        throw toGraphQLError(err);
      }
    },
  },
  Product: {
    id: (product) => product._id.toString(),
    createdAt: (product) => product.createdAt.toISOString(),
    updatedAt: (product) => product.updatedAt.toISOString(),
  },
};
