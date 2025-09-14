import { Id } from "./Id";
import { UserService } from "./services/UserService";
import { User } from "./User";
import { UserPresenter } from "./presenters/UserPresenter";
import { UserNotFoundError } from "./UserNotFoundError";
import { UsersPresenter } from "./presenters/UsersPresenter";
import { UuidService } from "./services/UuidService";

export interface UserUseCases {
  createUser(name: string, email: string): Promise<void>;
  getUser(_id: string, presenter: UserPresenter): Promise<void>;
  getAllUsers(presenter: UsersPresenter): Promise<void>;
}

export class UserUseCasesImpl implements UserUseCases {
  constructor(
    private userService: UserService,
    private uuidService: UuidService
  ) {}

  async createUser(name: string, email: string): Promise<void> {
    const user = new User({
      id: this.uuidService.generateUuid(),
      name,
      email,
    });
    await this.userService.saveUser(user.value);
  }

  async getUser(_id: string, presenter: UserPresenter): Promise<void> {
    const id = new Id(_id);
    const userDto = await this.userService.getUserById(id.value);
    if (!userDto) {
      throw new UserNotFoundError(id.value);
    }
    const user = new User(userDto);
    presenter.present(user.value);
  }

  async getAllUsers(presenter: UsersPresenter): Promise<void> {
    const usersDto = await this.userService.getAllUsers();
    const users = usersDto.map((userDto) => new User(userDto));
    presenter.present(users.map((user) => user.value));
  }
}
