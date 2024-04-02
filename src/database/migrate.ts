import { env } from "@/env";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

const connection = createClient({ url: env.DATABASE_URL });
const db = drizzle(connection);

await migrate(db, { migrationsFolder: "./drizzle" });

process.exit(0);
