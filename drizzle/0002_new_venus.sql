CREATE TABLE `check_ins` (
	`id` text NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`id`) REFERENCES `attendees`(`id`) ON UPDATE no action ON DELETE no action
);
