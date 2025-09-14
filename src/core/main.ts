import Fastify from "fastify";
import { dependenciesInjectionInit } from "./dependenciesInjection";
const fastify = Fastify({ logger: true });
dependenciesInjectionInit(fastify);
fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening at ${address}`);
});
