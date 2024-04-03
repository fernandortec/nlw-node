import { db } from "@/database/connection";
import { checkIns } from "@/database/schemas";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { t } from "typebox";

export async function checkIn(app: FastifyInstance): Promise<void> {
	app.withTypeProvider<TypeBoxTypeProvider>().get(
		"/attendees/:attendeeId/check-in",
		{
			schema: {
				params: t.Object({ attendeeId: t.Number(t.String()) }),
				response: {
					201: t.Null(),
				},
			},
		},
		async (request, reply) => {
			const { attendeeId } = request.params;

			const [attendeeCheckIn] = await db
				.select()
				.from(checkIns)
				.where(eq(checkIns.attendeeId, attendeeId));

			if (attendeeCheckIn) {
				throw new Error("Attendee already checked in!");
			}

			await db.insert(checkIns).values({
				attendeeId,
			});

			return reply.status(201).send();
		},
	);
}
