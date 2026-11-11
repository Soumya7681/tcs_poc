import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import { badInput, requireUser, toGraphQLError, unauthenticated } from '../errors.js';

const signToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });

export const authResolvers = {
  Query: {
    me: (_, __, context) => requireUser(context),
  },
  Mutation: {
    register: async (_, { name, email, password }) => {
      if (!name.trim() || !email.trim() || !password) {
        throw badInput('Name, email and password are required');
      }
      try {
        const user = await User.create({ name, email, password });
        return { user, token: signToken(user) };
      } catch (err) {
        throw toGraphQLError(err);
      }
    },
    login: async (_, { email, password }) => {
      if (!email.trim() || !password) throw badInput('Email and password are required');
      const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
      if (!user || !(await user.comparePassword(password))) {
        throw unauthenticated('Invalid email or password');
      }
      return { user, token: signToken(user) };
    },
  },
  User: {
    id: (user) => user._id.toString(),
  },
};
