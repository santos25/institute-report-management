import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Debug environment variables
console.log("DATABASE_URL:", process.env.DATABASE_URL);

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;

// Get the connection string from environment variables
const connectionString = `${process.env.DATABASE_URL}`;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Create the Neon adapter with the connection string
const adapter = new PrismaNeon({ connectionString });

// Create the Prisma client with the Neon adapter
const prisma = new PrismaClient({ adapter });

export default prisma;
