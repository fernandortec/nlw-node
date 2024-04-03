CREATE TABLE `check_ins` (
	`id` text PRIMARY KEY NOT NULL,
	`attendee_id` integer NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`attendee_id`) REFERENCES `attendees`(`id`) ON UPDATE no action ON DELETE no action
);
