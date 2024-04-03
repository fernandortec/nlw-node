import { db } from "@/database/connection";
import { events } from "@/database/schemas";
import { attendees } from "@/database/schemas/attendee";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { and, count, eq } from "drizzle-orm";
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

			const [attendeeFromEmail] = await db
				.select()
				.from(attendees)
				.where(and(eq(attendees.eventId, eventId), eq(attendees.email, email)));

			if (attendeeFromEmail) {
				throw new Error("This e-mail is already registered for this event");
			}

			const [[event], [amountOfAttendeesForEvent]] = await Promise.all([
				db.select().from(events).where(eq(events.id, eventId)),
				db
					.select({ count: count() })
					.from(attendees)
					.where(eq(attendees.eventId, eventId)),
			]);

			if (
				event?.maximumAttendees &&
				amountOfAttendeesForEvent.count >= event.maximumAttendees
			) {
				throw new Error(
					"Maximum number of attendees for this event has been reached",
				);
			}

			const [attendee] = await db
				.insert(attendees)
				.values({ email, eventId, name })
				.returning();

			return reply.status(201).send({ attendeeId: attendee.id });
		},
	);
}
