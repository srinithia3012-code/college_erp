import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

// Connect to Neon using DATABASE_URL
const sql = postgres(process.env.DATABASE_URL!, {
  ssl: "require", // Neon requires SSL
});

export const db = drizzle(sql);
