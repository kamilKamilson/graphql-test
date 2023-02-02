import { Request } from "express";

interface IRequestWithUserId extends Request {
  userId?: number;
}
