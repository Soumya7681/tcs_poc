import { GraphQLError } from 'graphql';

export const unauthenticated = (message = 'Not authorized') =>
  new GraphQLError(message, { extensions: { code: 'UNAUTHENTICATED', http: { status: 401 } } });

export const badInput = (message) =>
  new GraphQLError(message, { extensions: { code: 'BAD_USER_INPUT' } });

export const notFound = (message) =>
  new GraphQLError(message, { extensions: { code: 'NOT_FOUND' } });

export const requireUser = (context) => {
  if (!context.user) throw unauthenticated();
  return context.user;
};

export const toGraphQLError = (err) => {
  if (err instanceof GraphQLError) return err;
  if (err.name === 'ValidationError') {
    return badInput(Object.values(err.errors).map((e) => e.message).join(', '));
  }
  if (err.name === 'CastError') return badInput('Invalid id');
  if (err.code === 11000) return badInput('Email already registered');
  return err;
};
