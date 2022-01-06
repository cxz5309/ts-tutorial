import express from 'express';
import {ApolloServer} from 'apollo-server-express'; 
import depthLimit from 'graphql-depth-limit';
import {createServer} from 'http';
import compression from 'compression';
import cors from 'cors';
// import schema from './schema';


const app = express();
const server = new ApolloServer({
  validationRules: [depthLimit(7)],
});

app.use('*', cors());
app.use(compression());