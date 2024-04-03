CREATE TABLE `events` (
	`id` text NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`details` text,
	`maximum_attendees` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `events_slug_unique` ON `events` (`slug`);