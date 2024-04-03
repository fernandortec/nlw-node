import { db } from "@/database/connection";
import { attendees, checkIns } from "@/database/schemas";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { and, eq, like } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { t } from "typebox";

export async function getEventAttendees(app: FastifyInstance): Promise<void> {
	app.withTypeProvider<TypeBoxTypeProvider>().get(
		"/events/:eventId/attendees",
		{
			schema: {
				params: t.Object({ eventId: t.String() }),
				querystring: t.Object({
					pageIndex: t.Nullish(t.Number(t.String())),
					query: t.Nullish(t.String()),
				}),
				response: {
					200: t.Object({
						attendees: t.Array(
							t.Object({
								id: t.Number(),
								name: t.String(),
								email: t.String(),
								createdAt: t.Nullable(t.Number()),
								checkedInAt: t.Nullable(t.Number())
							}),
						),
					}),
				},
			},
		},
		async (request, reply) => {
			const { eventId } = request.params;
			const { pageIndex, query } = request.query;

			const attendeesByEvent = await db
				.select({
					id: attendees.id,
					name: attendees.name,
					email: attendees.email,
					createdAt: attendees.createdAt,
					checkedInAt: checkIns.createdAt,
				})
				.from(attendees)
				.where(
					query
						? and(
								eq(attendees.eventId, eventId),
								like(attendees.name, `%${query}%`),
							)
						: eq(attendees.eventId, eventId),
				)
				.leftJoin(checkIns, eq(checkIns.attendeeId, attendees.id))
				.limit(10)
				.offset(pageIndex ?? 0 * 10);

				console.log(attendeesByEvent)

			return reply.send({ attendees: attendeesByEvent });
		},
	);
}
