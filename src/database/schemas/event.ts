import { attendees } from "@/database/schemas/attendee";
import { createId } from "@paralleldrive/cuid2";
import { type InferSelectModel, relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const events = sqliteTable("events", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	slug: text("slug").unique().notNull(),
	title: text("title").notNull(),
	details: text("details"),
	maximumAttendees: int("maximum_attendees"),
});

export const eventsRelations = relations(events, ({ many }) => ({
	attendees: many(attendees),
}));

export type Event = InferSelectModel<typeof events>;
