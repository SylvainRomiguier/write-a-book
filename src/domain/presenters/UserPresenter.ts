import { UserDto } from "../services/UserService";

export interface UserPresenter {
  present(userDto: UserDto): void;
}

