module.exports = `
  type Query {
    user(id: ID!): User
    users: [User!]!
  }

  type User {
    id: ID!
    login: String!
    email: String!
  }
`;


// module.exports = `
//   type User {
//     id: ID!
//     login: String!
//     email: String!
//   }

//   type Query {
//     user(id: ID!): User
//     users: [User!]!
//   }
// `;
