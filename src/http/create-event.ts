import { db } from "@/database/connection";
import { events } from "@/database/schemas";
import { generateSlug } from "@/helpers/generate-slug";
import { eq } from "drizzle-orm";

import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import * as t from "@sinclair/typebox";
import type { FastifyInstance } from "fastify";

export async function createEvent(app: FastifyInstance): Promise<void> {
	app.withTypeProvider<TypeBoxTypeProvider>().post(
		"/events",
		{
			schema: {
				body: t.Object({
					title: t.String({ minLength: 4 }),
					details: t.Optional(t.String()),
					maximumAttendees: t.Optional(t.Integer({ minimum: 0 })),
				}),
				response: {
					201: t.Object({ eventId: t.String({ format: "uuid" }) }),
				},
			},
		},
		async (request, reply): Promise<void> => {
			const { title, details, maximumAttendees } = request.body;

			const slug = generateSlug(title);

			const [eventWithSameSlug] = await db
				.select()
				.from(events)
				.where(eq(events.slug, slug));

			if (eventWithSameSlug) throw new Error("Slug already exists");

			const [event] = await db
				.insert(events)
				.values({
					slug,
					title: title,
					details: details,
					maximumAttendees: maximumAttendees,
				})
				.returning();

			return reply.status(201).send({ eventId: event.id });
		},
	);
}
