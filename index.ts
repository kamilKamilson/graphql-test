import express from "express";
import { graphqlHTTP } from "express-graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import resolvers from "./resolvers";
import typeDefs from "./schema";
import { PrismaClient } from "@prisma/client";

import { getUserIdMiddleware } from "./services/user";

const prisma = new PrismaClient();

export const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

const app = express();

app.use(getUserIdMiddleware);

app.use(
  "/graphql",
  graphqlHTTP((req: any) => ({
    schema: schema,
    context: { prisma, userId: req.userId },
    graphiql: true,
  }))
);

app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");
