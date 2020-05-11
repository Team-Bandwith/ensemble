const graphql = require("graphql");
const express = require("express");
const expressGraphQl = require("express-graphql");
const { GraphQLSchema } = graphql;
const { query } = require('./db/schemas/query');
const { mutation } = require('./db/schemas/mutation');

const schema = new GraphQLSchema({
  query,
  mutation
});

var app = express();
app.use(
  '/',
  expressGraphQl({
    schema: schema,
    graphiql: true
  })
);

app.listen(8081, () =>
  console.log('GraphQL server running on localhost:8081')
);