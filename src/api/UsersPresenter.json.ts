import { UsersPresenter } from "../domain/presenters/UsersPresenter";
import { UserDto } from "../domain/services/UserService";

type JsonUserDto = {
  id: string;
  name: string;
  email: string;
};

export class JsonUsersPresenter implements UsersPresenter {
  private jsonUsers: JsonUserDto[] = [];
  present(usersDto: UserDto[]): void {
    this.jsonUsers = usersDto.map(userDto => ({
      id: userDto.id,
      name: userDto.name,
      email: userDto.email,
    }));
  }
  getJson(): JsonUserDto[] {
    return this.jsonUsers;
  
  }
}
