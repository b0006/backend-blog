module.exports = `
  extend type Query {
    user(id: ID!): User
    users: [User!]!
  }

  type User {
    id: ID!
    login: String!
    email: String!
  }
`;
