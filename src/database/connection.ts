import { env } from "@/env";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schemas from "@/database/schemas";

const client = createClient({
	url: env.DATABASE_URL,
	authToken: env.DATABASE_TOKEN,
});

export const db = drizzle(client, { schema: schemas });
