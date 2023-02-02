import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const create = async (
  userId: number,
  title: string,
  description: string
) =>
  prisma.boat.create({
    data: {
      title,
      description,
      userId,
    },
  });
