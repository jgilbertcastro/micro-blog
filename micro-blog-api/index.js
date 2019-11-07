const  express  =  require('express');
const ExpressGraphQL = require("express-graphql");
const schema = require("./graphql/post/post.js");
const  app  =  express();

app.use("/graphql", ExpressGraphQL({ schema: schema.schema, graphiql: true}));

app.listen(4000, () => {
    console.log("GraphQL server running at http://localhost:4000.");
});