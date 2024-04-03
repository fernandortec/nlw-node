import { createEvent } from "@/http/create-event";
import { TypeBoxValidatorCompiler } from "@fastify/type-provider-typebox";
import fastify from "fastify";

const app = fastify();

app.setValidatorCompiler(TypeBoxValidatorCompiler);
app.register(createEvent);

app.listen({ port: 3000 }, () => {
	console.log("Server is running");
});
