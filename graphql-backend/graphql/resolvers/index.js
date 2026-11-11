import { authResolvers } from './auth.js';
import { productResolvers } from './product.js';

export const resolvers = {
  Query: { ...authResolvers.Query, ...productResolvers.Query },
  Mutation: { ...authResolvers.Mutation, ...productResolvers.Mutation },
  User: authResolvers.User,
  Product: productResolvers.Product,
};
