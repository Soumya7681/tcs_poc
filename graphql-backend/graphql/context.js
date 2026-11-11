import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const buildContext = async ({ req }) => {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) return { user: null };

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    return { user };
  } catch {
    return { user: null };
  }
};
