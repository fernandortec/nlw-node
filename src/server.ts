import { db } from "@/database/connection";
import { events } from "@/database/schemas";
import * as t from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import fastify from "fastify";

const app = fastify();

app.post("/events", async (request): Promise<void> => {
	const createEventSchema = t.Object({
		slug: t.String(),
		title: t.String({ minLength: 4 }),
		details: t.Optional(t.String()),
		maximumAttendees: t.Optional(t.Integer({ minimum: 0 })),
	});

	const data = Value.Decode(createEventSchema, request.body);

	await db.insert(events).values(data);

	console.log("inseriu uhul");
});

app.listen({ port: 3000 }, () => {
	console.log("Server is running");
});
