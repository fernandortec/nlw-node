import { createEvent } from "@/http/create-event";
import { getAttendeeBadge } from "@/http/get-attendee-badge";
import { getEvent } from "@/http/get-event";
import { registerForEvent } from "@/http/register-for-event";
import { TypeBoxValidatorCompiler } from "@fastify/type-provider-typebox";

import { checkIn } from "@/http/check-in";
import { getEventAttendees } from "@/http/get-event-attendees";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";

const app = fastify();

app.register(fastifySwagger, {
	swagger: {
		consumes: ["application/json"],
		produces: ["application/json"],
		info: {
			title: "pass.in",
			description:
				"Especificações da API para o back-end da aplicação pass.in construída durante o NLW Unite da Rocketseat",
			version: "1.0.0",
		},
	},
});
app.register(fastifySwaggerUi, {
	routePrefix: "/docs",
});

app.setValidatorCompiler(TypeBoxValidatorCompiler);

app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(checkIn);
app.register(getEventAttendees);

app.listen({ port: 3000 }, () => {
	console.log("Server is running");
});
