const graphql = require('graphql');
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const expressGraphQl = require('express-graphql');

const { GraphQLSchema } = graphql;
const { query } = require('./db/schemas/query');
const { mutation } = require('./db/schemas/mutation');

const schema = new GraphQLSchema({
  query,
  mutation,
});

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('dist'));

app.use(
  '/api',
  expressGraphQl({
    schema,
    graphiql: true,
  }),
);

app.post('/verify', (req, res) => {
  const { token } = req.body;
  jwt.verify(token, process.env.secret, (err, decoded) => {
    if(err) {
      return res.status(500).send();
    }
    return res.status(200).send(decoded);
  });
})

app.listen(process.env.S_PORT, () => console.log('GraphQL server running on localhost:8081'));
