import { Email } from "./Email";
import { Id } from "./Id";
import { Name } from "./Name";
import { UserDto } from "./services/UserService";

export class User {
  private readonly _id: Id;
  private readonly _name: Name;
  private readonly _email: Email;

  constructor(userDto: UserDto) {
    this._id = new Id(userDto.id);
    this._name = new Name(userDto.name);
    this._email = new Email(userDto.email);
  }

  get value(): UserDto {
    return Object.freeze({
      id: this._id.value,
      name: this._name.value,
      email: this._email.value,
    });
  }
}
