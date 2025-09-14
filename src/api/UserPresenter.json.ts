import { UserPresenter } from "../domain/presenters/UserPresenter";
import { UserDto } from "../domain/services/UserService";
type JsonUserDto = {
  id: string;
  name: string;
  email: string;
};

export class JsonUserPresenter implements UserPresenter {
  private jsonUser: JsonUserDto | null = null;
  present(userDto: UserDto): void {
    this.jsonUser = {
      id: userDto.id,
      name: userDto.name,
      email: userDto.email,
    };
  }
  getJson(): JsonUserDto {
    if (this.jsonUser === null) {
      throw new Error("No user has been presented yet.");
    }
    return this.jsonUser;
  }
}
