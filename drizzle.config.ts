import { Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts",
  out: "./db/drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DB_URL!,
  },
} satisfies Config;
