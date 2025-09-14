
export type UserDto = {
    id: string;
    name: string;
    email: string;
}

export interface UserService {
    saveUser(user: UserDto): Promise<void>;
    getUserById(id: string): Promise<UserDto | null>;
    getAllUsers(): Promise<UserDto[]>;
}