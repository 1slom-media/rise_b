import cors from 'cors';
import express, { Application } from 'express';
import session from 'express-session';
import http from "http";
import passport from './utils/gf';
import { AppDataSource } from './data-source';
import router from './routes';
import path from 'path';
import fs from 'fs';
import { ApolloServer, gql } from 'apollo-server-express';
import { resolvers } from './resolvers';

const PORT = process.env.PORT || 5000

const app: Application = express();
const httpServer = http.createServer(app);

const schema = fs.readFileSync(path.resolve(process.cwd(), "src", "graphql", "schema.gql"));


const server = new ApolloServer({
  typeDefs: gql`${schema}`,
  resolvers,
  context: async ({ req }) => ({ token: req.headers.token }),
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
AppDataSource.initialize().then((): void => console.log("connected")).catch((err: unknown): void => console.log(err));
app.use('/static', express.static(path.join(process.cwd(), 'uploads')))
app.use(router);

(async () => {
  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`);
})();
