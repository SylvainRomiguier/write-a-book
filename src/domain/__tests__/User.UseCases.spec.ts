// src/domain/__tests__/User.UseCases.spec.ts

import { beforeAll, describe, expect, test, vi } from "vitest";
import { UserService } from "../services/UserService";
import { UuidService } from "../services/UuidService";
import { UserPresenter } from "../presenters/UserPresenter";
import { UsersPresenter } from "../presenters/UsersPresenter";
import { UserServiceInMemory } from "./UserService.inMemory";
import { UuidServiceMock } from "./UuidService.Mock";
import { UserUseCasesImpl } from "../User.UseCases";

describe("UserUseCases", () => {
  let mockUserService: UserService;
  let mockUuidService: UuidService;
  let userPresenter: UserPresenter;
  let usersPresenter: UsersPresenter;
  let useCases: UserUseCasesImpl;

  beforeAll(() => {
    // Setup mocks
    mockUserService = new UserServiceInMemory();
    mockUuidService = new UuidServiceMock();
    // Initialize presenters
    userPresenter = {
      present: vi.fn(),
    };
    usersPresenter = {
      present: vi.fn(),
    };
    // Initialize UserUseCases with mocks
    useCases = new UserUseCasesImpl(mockUserService, mockUuidService);
    return new Promise((resolve) => {
      resolve(useCases);
    });
  });

  test("createUser", async () => {
    mockUserService.saveUser = vi.fn().mockResolvedValue(undefined);
    await useCases.createUser("John Doe", "john.doe@example.com");

    // Verify that the mock service was called
    expect(mockUserService.saveUser).toHaveBeenCalledTimes(1);
  });

  test("getUser", async () => {
    const id = "12345678-1234-1234-1234-123456789012";
    const userDto = {
      id,
      name: "John Doe",
      email: "john.doe@example.com",
    };
    mockUserService.getUserById = vi.fn().mockResolvedValue(userDto);
    await useCases.getUser(id, userPresenter);

    // Verify that the mock service was called
    expect(mockUserService.getUserById).toHaveBeenCalledTimes(1);
    expect(userPresenter.present).toHaveBeenCalledWith({
      id: userDto.id,
      name: userDto.name,
      email: userDto.email,
    });
  });

  test("getUsers", async () => {
    const usersDto = [
      {
        id: mockUuidService.generateUuid(),
        name: "User One",
        email: "user.one@example.com",
      },
      {
        id: mockUuidService.generateUuid(),
        name: "User Two",
        email: "user.two@example.com",
      },
      {
        id: mockUuidService.generateUuid(),
        name: "User Three",
        email: "user.three@examplke.com",
      },
    ];
    mockUserService.getAllUsers = vi.fn().mockResolvedValue(usersDto);
    usersPresenter = {
      present: vi.fn(),
    };
    await useCases.getAllUsers(usersPresenter);
    // Verify that the mock service was called
    expect(mockUserService.getAllUsers).toHaveBeenCalledTimes(1);
    expect(usersPresenter.present).toHaveBeenCalledWith(
      usersDto.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
      }))
    );
  });
});
