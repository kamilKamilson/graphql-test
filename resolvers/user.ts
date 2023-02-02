import { PrismaClient } from "@prisma/client";
import * as userServices from "../services/user";
import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated } from "./auth";

export default {
  Query: {
    me: combineResolvers(
      isAuthenticated as any,
      (
        _: any,
        {},
        { prisma, userId }: { prisma: PrismaClient; userId: number }
      ) => prisma.user.findUnique({ where: { id: userId } })
    ),
    allUsers: (_: any, {}, { prisma }: { prisma: PrismaClient }) =>
      prisma.user.findMany(),
    getUser: (
      _: any,
      { id }: { id: number },
      { prisma }: { prisma: PrismaClient }
    ) => prisma.user.findUnique({ where: { id } }),
  },

  Mutation: {
    registerUser: (
      _: any,
      {
        firstName,
        lastName,
        email,
        password,
      }: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
      }
    ) => userServices.register(firstName, lastName, email, password),
    loginUser: (
      _: any,
      {
        email,
        password,
      }: {
        email: string;
        password: string;
      }
    ) => userServices.login(email, password),
    updateUser: (
      _: any,
      {
        id,
        firstName,
        lastName,
        email,
      }: {
        id: number;
        firstName?: string;
        lastName?: string;
        email?: string;
      },
      { prisma }: { prisma: PrismaClient }
    ) =>
      prisma.user.update({
        where: { id },
        data: { firstName, lastName, email },
      }),
    deleteUser: async (
      _: any,
      { id }: { id: number },
      { prisma }: { prisma: PrismaClient }
    ) => {
      try {
        await prisma.user.delete({ where: { id } });
        return true;
      } catch (error) {
        return false;
      }
    },
  },
};
