import { FastifyInstance } from "fastify";
import { UserControllerFastify } from "../api/UserController.fastify";
import { UserUseCasesImpl } from "../domain/User.UseCases";
import { UserServiceSqlite } from "../spi/UserService.sqlite";
import { UuidNodeService } from "../spi/UuidService.node";

export const dependenciesInjectionInit = (fastify: FastifyInstance) => {
  const userService = new UserServiceSqlite();
  userService.init().catch((error) => {
    fastify.log.error("Failed to initialize UserService:", error);
    process.exit(1);
  });
  const uuidService = new UuidNodeService();
  const userUseCases = new UserUseCasesImpl(userService, uuidService);
  const userController = new UserControllerFastify(userUseCases);
  userController.registerRoutes(fastify);
};
