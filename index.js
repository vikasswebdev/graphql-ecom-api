var express = require("express");
var { graphqlHTTP } = require("express-graphql");
var { buildSchema } = require("graphql");
const connectDB = require("./config/database");
const dotenv = require("dotenv").config();

const graphiqlSchema = require("./graphql/schema");
const graphiqlResolvers = require("./graphql/resolvers");
const auth = require("./middleware/auth");
const role = require("./middleware/role");

var app = express();

app.use(auth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphiqlSchema,
    rootValue: graphiqlResolvers,
    graphiql: true,
  })
);

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
