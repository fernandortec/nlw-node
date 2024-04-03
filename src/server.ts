import { checkIn } from "@/http/check-in";
import { createEvent } from "@/http/create-event";
import { getAttendeeBadge } from "@/http/get-attendee-badge";
import { getEvent } from "@/http/get-event";
import { registerForEvent } from "@/http/register-for-event";
import { TypeBoxValidatorCompiler } from "@fastify/type-provider-typebox";
import fastify from "fastify";

const app = fastify();

app.setValidatorCompiler(TypeBoxValidatorCompiler);
app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge)
app.register(checkIn);

app.listen({ port: 3000 }, () => {
	console.log("Server is running");
});
