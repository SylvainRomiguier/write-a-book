import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { UserUseCases } from "../domain/User.UseCases";
import { UserNotFoundError } from "../domain/UserNotFoundError";
import { JsonUserPresenter } from "./UserPresenter.json";
import { JsonUsersPresenter } from "./UsersPresenter.json";

type OneOnly<Obj, Key extends keyof Obj> = {
  [key in Exclude<keyof Obj, Key>]: null;
} & Pick<Obj, Key>;

type RequestOptions = OneOnly<
  { Params: { id: string }; Body: { name: string; email: string } },
  "Params" | "Body"
>;

export class UserControllerFastify {
  constructor(private userUseCases: UserUseCases) {}

  private async getUser(
    request: FastifyRequest<RequestOptions>,
    reply: FastifyReply
  ) {
    const userId = request.params.id;
    try {
      const userPresenter = new JsonUserPresenter();
      await this.userUseCases.getUser(userId, userPresenter);
      reply.send(userPresenter.getJson());
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        reply.status(404).send({ error: error.message });
      } else {
        reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  }

  private async createUser(
    request: FastifyRequest<RequestOptions>,
    reply: FastifyReply
  ) {
    const userData = request.body;
    try {
      await this.userUseCases.createUser(userData.name, userData.email);
      reply.status(201).send({ message: "User created successfully" });
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  }

  private async getAllUsers(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const usersPresenter = new JsonUsersPresenter();
      await this.userUseCases.getAllUsers(usersPresenter);
      reply.send(usersPresenter.getJson());
    } catch (error) {
      console.error("Error fetching users:", error);
      reply.status(500).send({ error: "Internal Server Error" });
    }
  }

  private getRoutes() {
    return [
      {
        method: "GET",
        url: "/users/:id",
        schema: {
          params: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
            },
            required: ["id"],
          },
        },
        handler: this.getUser.bind(this),
      },
      {
        method: "POST",
        url: "/users",
        schema: {
          body: {
            type: "object",
            properties: {
              name: { type: "string" },
              email: { type: "string", format: "email" },
            },
            required: ["name", "email"],
          },
        },
        handler: this.createUser.bind(this),
      },
      {
        method: "GET",
        url: "/users",
        schema: {},
        handler: this.getAllUsers.bind(this),
      },
    ];
  }
  registerRoutes(fastify: FastifyInstance) {
    this.getRoutes().forEach((route) => {
      fastify.route({
        method: route.method,
        url: route.url,
        schema: route.schema,
        handler: route.handler,
      });
    });
  }
}
