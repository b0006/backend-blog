const schema = `
  type Query {
    user(id: ID!): User
    users: [User!]!
  }

  type User {
    id: ID!
    login: String!
    email: String!
  }
`

export default schema;
