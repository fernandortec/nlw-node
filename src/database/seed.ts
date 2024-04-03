import { db } from "@/database/connection";
import { attendees, checkIns, events } from "@/database/schemas";

await db.delete(attendees)
await db.delete(checkIns)
await db.delete(events);

await db.insert(events).values({
	id: "clukdc0n3000008lfcvgifqia",
	slug: "unite-summit",
	title: "Unite summit",
	details: "Um evento p/ devs apaixonados(as) por código!",
	maximumAttendees: 120,
});

console.log("Database seeded successfully!");

process.exit();
