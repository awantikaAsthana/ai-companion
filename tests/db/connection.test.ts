import postgres from "postgres";
import { sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "../../db";

async function ensureTestDatabaseExists() {
  const mainUrl = process.env.DATABASE_URL;
  if (!mainUrl) return;

  const testUrl =
    process.env.TEST_DATABASE_URL ||
    mainUrl.replace(/\/[^/]+(?:\?|$)/, (match) => {
      const queryIndex = match.indexOf("?");
      const query = queryIndex !== -1 ? match.slice(queryIndex) : "";
      return "/ai_companion_test" + query;
    });

  const testUrlObj = new URL(testUrl);
  const testDbName = testUrlObj.pathname.replace(/^\//, "");

  const mainUrlObj = new URL(mainUrl);
  const mainDbName = mainUrlObj.pathname.replace(/^\//, "");

  if (!testDbName || testDbName === mainDbName) return;

  try {
    const adminClient = postgres(mainUrl, { max: 1 });
    const existing = await adminClient`
      SELECT 1 FROM pg_database WHERE datname = ${testDbName}
    `;

    if (existing.length === 0) {
      console.log(`Database "${testDbName}" not found. Creating it...`);
      await adminClient.unsafe(`CREATE DATABASE "${testDbName}"`);
      console.log(`Database "${testDbName}" created successfully.`);
    }

    await adminClient.end();
  } catch (err) {
    console.warn(
      `Note: Could not verify/create database "${testDbName}":`,
      err instanceof Error ? err.message : err,
    );
  }
}

async function main() {
  await ensureTestDatabaseExists();

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
