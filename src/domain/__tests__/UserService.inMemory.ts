import { UserDto, UserService } from "../services/UserService";

export class UserServiceInMemory implements UserService {
  private users: Map<string,UserDto> = new Map();

  async saveUser(userDto: UserDto): Promise<void> {
    this.users.set(userDto.id, userDto);
  }

  async getUserById(id: string): Promise<UserDto | null> {
    return this.users.get(id) || null;
  }

  async getAllUsers(): Promise<UserDto[]> {
    return Array.from(this.users.values());
  }

  cleanup(): void {
    this.users.clear();
  }
}