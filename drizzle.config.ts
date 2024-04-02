import type { Config } from "drizzle-kit";
import { env } from "./src/env";

export default {
	schema: "./src/database/schemas/index.ts",
	out: "./drizzle",
	driver: "libsql",
	dbCredentials: {
		url: env.DATABASE_URL,
	},
} satisfies Config;
