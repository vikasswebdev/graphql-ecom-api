const { buildSchema } = require("graphql");

module.exports = buildSchema(`
 type Product {
    _id: ID!
    user: User!
    name: String!
    slug: String!
    imageUrl: String!
    price: Float!
    description: String!
    quantity: Int!
    taxable: Boolean!
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
 }

  type User {
    _id: ID
    name: String
    email: String
    password: String
    role: String
  }

  type ProductData {
    products: [Product!]!
    total: Int!
  }

  type AuthData {
    token: String!
    userId: String!
    email: String!
    name: String!
    role: String!
  }

  input ProductInput {
    name: String!
    imageUrl: String!
    price: Float!
    description: String!
    quantity: Int!
    taxable: Boolean!
    isActive: Boolean!
  } 

  input UserInputData {
    email: String!
    name: String!
    password: String!
  }

  type RootQuery {
    login(email: String!, password: String!): AuthData!
    user: User!
    products(page: Int, limit: Int): ProductData!
    product(slug: String!): Product!
  }

  type RootMutation {
    createUser(userInput: UserInputData): User!
    createProduct(productInput: ProductInput): Product!
   }

  schema {    
     query: RootQuery
    mutation: RootMutation
    }

 `);
