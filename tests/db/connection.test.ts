import { sql } from "drizzle-orm";
import { db } from "../../db";

async function main() {
  const result = await db.execute(sql`SELECT 1 AS connected`);

  console.log("Database connected:", result[0]);
  process.exit(0);
}

main().catch((error) => {
  console.error("Database connection failed:", error);
  process.exit(1);
});
