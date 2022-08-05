import {ApolloServer, gql} from "apollo-server";
import * as fs from 'fs'
import resolvers from "./resolvers";

const server = new ApolloServer({
  typeDefs: gql(fs.readFileSync(__dirname + '/schema.graphql', 'utf-8')),
  resolvers,
  formatError: (error) => {
    console.log(JSON.stringify(error, null, 2))
    return error
  }
});

server.listen(process.env.NODE_ENV === 'production' ? 443 : 4000)
  .then(({url}) => console.log(`🚀  Server ready at ${url}`));
