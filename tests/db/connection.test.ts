import { sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "../../db";

async function main() {
  const result = await db.execute(
    sql`SELECT 1 AS connected, current_database() AS db_name`,
  );

  console.log("Database connected:", result[0]);

  // Ensure test database has all schema migrations applied
  await migrate(db, { migrationsFolder: "./db/migrations" });

  process.exit(0);
}

main().catch((error) => {
  console.error("Database connection failed:", error);
  process.exit(1);
});
