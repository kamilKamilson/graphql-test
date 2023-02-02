import bcrypt from "bcrypt";
import { PrismaClient, User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextFunction } from "express";
import { env } from "process";
import { Response } from "express";
import { IRequestWithUserId } from "../types";

const SECRET = env.JWT_SECRET as string;

const generateToken = (user: User) => {
  return jwt.sign(
    {
      id: user.id,
    },
    SECRET,
    {
      expiresIn: "30d",
    }
  );
};

const prisma = new PrismaClient();

export const register = (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  const passwordHash = bcrypt.hashSync(password, 10);
  return prisma.user.create({
    data: { firstName, lastName, email, passwordHash },
  });
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new Error("Invalid email or password");

  const passwordMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!passwordMatch) throw new Error("Invalid email or password");

  return {
    token: generateToken(user),
    user,
  };
};

export const getUserIdMiddleware = (
  req: IRequestWithUserId,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  try {
    if (token) {
      const { id } = jwt.verify(token, SECRET) as { id: number };
      req.userId = id;
    }
  } catch (error) {
    console.log(error);
  }

  next();
};
