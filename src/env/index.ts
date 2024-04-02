import * as t from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const envSchema = t.Object({
	DATABASE_URL: t.String({ minLength: 1 }),
});

export const env = Value.Decode(envSchema, process.env);
