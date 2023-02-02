import { skip } from "graphql-resolvers";

export const isAuthenticated = (
  _: any,
  __: any,
  { userId }: { userId?: string }
) => (userId ? skip : new Error("Not authenticated"));
