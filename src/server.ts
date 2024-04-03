import { createEvent } from "@/http/create-event";
import { registerForEvent } from "@/http/register-for-event";
import { TypeBoxValidatorCompiler } from "@fastify/type-provider-typebox";
import fastify from "fastify";

const app = fastify();

app.setValidatorCompiler(TypeBoxValidatorCompiler);
app.register(createEvent);
app.register(registerForEvent)

app.listen({ port: 3000 }, () => {
	console.log("Server is running");
});
