import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const isTest =
  process.env.NODE_ENV === "test" ||
  process.env.npm_lifecycle_event === "test" ||
  process.argv.some((arg) => typeof arg === "string" && arg.includes("test"));

let connectionString: string | undefined;

if (isTest) {
  connectionString =
    process.env.TEST_DATABASE_URL ||
    process.env.DATABASE_URL?.replace(/\/[^/]+(?:\?|$)/, (match) => {
      const queryIndex = match.indexOf("?");
      const query = queryIndex !== -1 ? match.slice(queryIndex) : "";
      return "/ai_companion_test" + query;
    });

  if (
    connectionString &&
    /\/ai_companion(?:\?|$)/.test(connectionString) &&
    !connectionString.includes("/ai_companion_test")
  ) {
    throw new Error(
      "CRITICAL SAFETY ERROR: Test environment detected but database connection string points to development database 'ai_companion'. Tests must run against 'ai_companion_test' to protect development data."
    );
  }
} else {
  connectionString = process.env.DATABASE_URL;
}

if (!connectionString) {
  throw new Error(
    isTest
      ? "TEST_DATABASE_URL or DATABASE_URL is not set"
      : "DATABASE_URL is not set",
  );
}

const client = postgres(connectionString);

export const db = drizzle(client);
