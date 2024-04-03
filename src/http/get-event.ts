import { db } from "@/database/connection";
import { events, attendees } from "@/database/schemas";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { count, eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { t } from "typebox";

export async function getEvent(app: FastifyInstance): Promise<void> {
	app.withTypeProvider<TypeBoxTypeProvider>().get(
		"/events/:eventId",
		{
			schema: {
				params: t.Object({ eventId: t.String() }),
				response: {
					200: t.Object({
						event: t.Object({
							id: t.String(),
							title: t.String(),
							slug: t.String(),
							details: t.Union([t.Null(), t.String()]),
							maximumAttendees: t.Union([t.Null(), t.Number()]),
							attendeesAmount: t.Number(),
						}),
					}),
				},
			},
		},
		async (request, reply) => {
			const { eventId } = request.params;

			const [event] = await db
				.select({
					id: events.id,
					slug: events.slug,
					count: {
						attendees: count(attendees.id),
					},
					title: events.title,
					details: events.details,
					maximumAttendees: events.maximumAttendees,
				})
				.from(events)
				.where(eq(events.id, eventId))
				.leftJoin(attendees, eq(events.id, attendees.eventId));

			if (!event) {
				throw new Error("Event not found");
			}

			return reply.send({
				event: {
					id: event.id,
					title: event.title,
					slug: event.slug,
					details: event.details,
					maximumAttendees: event.maximumAttendees,
					attendeesAmount: event.count.attendees,
				},
			});
		},
	);
}
