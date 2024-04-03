import { attendees } from "@/database/schemas";
import { createId } from "@paralleldrive/cuid2";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const checkins = sqliteTable("check_ins", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
  attendeeId: text("id").notNull().references(() => attendees.id),

	createdAt: integer("created_at", { mode: "timestamp" }),
});
