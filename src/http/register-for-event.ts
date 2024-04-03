import { db } from "@/database/connection";
import { attendees } from "@/database/schemas/attendee";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";
import { t } from "typebox";

export async function registerForEvent(app: FastifyInstance): Promise<void> {
	app.withTypeProvider<TypeBoxTypeProvider>().post(
		"/events/:eventId/attendees",
		{
			schema: {
				body: t.Object({
					name: t.String({ minLength: 4 }),
					email: t.String(),
				}),
				params: t.Object({ eventId: t.String() }),
				response: {
					201: t.Object({ attendeeId: t.Number() }),
				},
			},
		},
		async (request, reply) => {
			const { email, name } = request.body;
			const { eventId } = request.params;

			const [attendee] = await db
				.insert(attendees)
				.values({ email, eventId, name })
				.returning();

			return reply.status(201).send({ attendeeId: attendee.id });
		},
	);
}
