import { UserDto } from "../services/UserService";

export interface UsersPresenter {
  present(usersDto: UserDto[]): void;
}

