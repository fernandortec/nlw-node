import { db } from "@/database/connection";
import { attendees } from "@/database/schemas";
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
					200: t.Object({ name: t.String(), email: t.String() }),
				},
			},
		},
		async (request, reply) => {
			const { attendeeId } = request.params;

			const [attendee] = await db
				.select({
					name: attendees.name,
					email: attendees.email,
				})
				.from(attendees)
				.where(eq(attendees.id, attendeeId));

			if (!attendee) {
				throw new Error("Attendee not found");
			}

			return reply.send(attendee);
		},
	);
}
