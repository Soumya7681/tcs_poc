export const typeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  type Product {
    id: ID!
    name: String!
    category: String!
    price: Float!
    salesImpacted: Float!
    averageSales: Float!
    notSold: Float!
    createdAt: String!
    updatedAt: String!
  }

  type SalesAverages {
    salesImpacted: Float!
    averageSales: Float!
    notSold: Float!
  }

  type ProductStats {
    total: Int!
    averages: SalesAverages!
  }

  input ProductInput {
    name: String!
    category: String!
    price: Float!
    salesImpacted: Float!
    averageSales: Float!
    notSold: Float!
  }

  input ProductUpdateInput {
    name: String
    category: String
    price: Float
    salesImpacted: Float
    averageSales: Float
    notSold: Float
  }

  type Query {
    me: User!
    products: [Product!]!
    productStats: ProductStats!
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    createProduct(input: ProductInput!): Product!
    updateProduct(id: ID!, input: ProductUpdateInput!): Product!
    deleteProduct(id: ID!): ID!
  }
`;
