import { PrismaClient } from "@prisma/client";
import * as boatService from "../services/boat";
import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated } from "./auth";

export default {
  Query: {
    allBoats: (_: any, {}, { prisma }: { prisma: PrismaClient }) =>
      prisma.boat.findMany(),
  },

  Boat: {
    user: (
      { userId }: { userId: number },
      _: any,
      { prisma }: { prisma: PrismaClient }
    ) => prisma.user.findUnique({ where: { id: userId } }),
  },

  Mutation: {
    createBoat: combineResolvers(
      isAuthenticated as any,
      (
        _: any,
        {
          title,
          description,
        }: {
          title: string;
          description: string;
        },
        { userId }: { userId: number }
      ) => boatService.create(userId, title, description)
    ),
  },
};
