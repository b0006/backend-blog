module.exports = `
  extend type Query {
    article(id: ID!): Article
    articles: [Article!]!
  }  

  type Article {
    id: ID!
    title: String!
    value: String!
    text: String!
  }
`;
