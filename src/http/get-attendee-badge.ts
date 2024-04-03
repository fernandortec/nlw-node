import { db } from "@/database/connection";
import { events, attendees } from "@/database/schemas";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { t } from "typebox";

export async function getAttendeeBadge(app: FastifyInstance): Promise<void> {
	app.withTypeProvider<TypeBoxTypeProvider>().get(
		"/attendees/:attendeeId",
		{
			schema: {
				params: t.Object({ attendeeId: t.Number(t.String()) }),
				response: {
					200: t.Object({
						badge: t.Object({
							name: t.String(),
							email: t.String(),
							eventTitle: t.Union([t.Null(), t.String()]),
							checkInUrl: t.String({ format: "uri" }),
						}),
					}),
				},
			},
		},
		async (request, reply) => {
			const { attendeeId } = request.params;

			const [attendee] = await db
				.select({
					id: attendees.id,
					name: attendees.name,
					email: attendees.email,
					eventTitle: events.title,
				})
				.from(attendees)
				.where(eq(attendees.id, attendeeId))
				.leftJoin(events, eq(events.id, attendees.eventId));

			if (!attendee) {
				throw new Error("Attendee not found");
			}

			const baseURL = `${request.protocol}://${request.hostname}`;

			const checkInUrl = new URL(`/attendees/${attendee.id}/check-in`, baseURL);

			return reply.send({
				badge: {
					name: attendee.name,
					email: attendee.email,
					eventTitle: attendee.eventTitle,
					checkInUrl: checkInUrl.toString(),
				},
			});
		},
	);
}
