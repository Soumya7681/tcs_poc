import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { typeDefs } from './graphql/typeDefs.js';
import { resolvers } from './graphql/resolvers/index.js';
import { buildContext } from './graphql/context.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5002;

const start = async () => {
  await connectDB();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    includeStacktraceInErrorResponses: process.env.NODE_ENV === 'development',
  });
  await server.start();

  const app = express();

  app.get('/health', (req, res) => res.json({ status: 'ok' }));
  app.use(
    '/graphql',
    cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }),
    express.json(),
    expressMiddleware(server, { context: buildContext })
  );

  app.listen(PORT, () => console.log(`GraphQL server running on http://localhost:${PORT}/graphql`));
};

start().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
