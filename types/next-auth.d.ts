import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: string;
    degreeIds: string[];
  }

  interface Session {
    user: {
      id: string;
      role: string;
      degreeIds: string[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    degreeIds: string[];
  }
}
