import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { describe, expect, it, beforeEach, vi, Mock } from "vitest";
import {
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserResponseDto } from "../users/transformers/user.transformer";
import { createMockUser } from "../users/factories/user.factory";

vi.mock("bcrypt", () => ({
  compare: vi.fn(),
}));

describe("AuthService", () => {
  let service: AuthService;
  let usersService: UsersService;

  const mockUser = createMockUser();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByUsername: vi.fn(),
            findByEmail: vi.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);

    vi.clearAllMocks();
  });

  describe("validateUser", () => {
    it("should successfully validate user with username", async () => {
      (bcrypt.compare as Mock).mockResolvedValue(true);

      (usersService.findByUsername as Mock).mockResolvedValue(mockUser);

      const result = await service.validateUser({
        username: mockUser.username,
        password: "veryStrongPassword",
      });

      expect(result).toBeDefined();
      if (result) {
        expect(result.username).toBe(mockUser.username);
        expect(result.email).toBe(mockUser.email);
      }
      expect(usersService.findByUsername).toHaveBeenCalled();
    });

    it("should successfully validate user with email", async () => {
      (bcrypt.compare as Mock).mockResolvedValue(true);

      (usersService.findByEmail as Mock).mockResolvedValue(mockUser);

      const result = await service.validateUser({
        email: mockUser.email,
        password: "veryStrongPassword",
      });

      expect(result).toBeDefined();
      if (result) {
        expect(result.username).toBe(mockUser.username);
        expect(result.email).toBe(mockUser.email);
      }
      expect(usersService.findByEmail).toHaveBeenCalled();
    });

    it("should throw NotFoundException when user is not found", async () => {
      (usersService.findByUsername as Mock).mockResolvedValue(null);

      await expect(
        service.validateUser({
          username: "notExist",
          password: "veryStrongPassword",
        })
      ).rejects.toThrow(NotFoundException);

      expect(usersService.findByUsername).toHaveBeenCalled();
    });

    it("should throw UnauthorizedException when password is invalid", async () => {
      (bcrypt.compare as Mock).mockResolvedValue(false);

      (usersService.findByUsername as Mock).mockResolvedValue(mockUser);

      await expect(
        service.validateUser({
          username: mockUser.username,
          password: "wrongpassword",
        })
      ).rejects.toThrow(UnauthorizedException);

      expect(usersService.findByUsername).toHaveBeenCalled();
    });

    it("should throw InternalServerErrorException when error in user validation", async () => {
      const dbError = new Error("Database connection failed");
      (usersService.findByUsername as Mock).mockRejectedValue(dbError);

      await expect(
        service.validateUser({
          username: mockUser.username,
          password: "veryStrongPassword",
        })
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe("login", () => {
    it("should generate JWT token and return user", async () => {
      const mockToken = "mock.jwt.token";
      (service["jwtService"].signAsync as Mock).mockResolvedValue(mockToken);

      const mockUserResponse = new UserResponseDto(mockUser);

      const result = await service.login(mockUserResponse);

      expect(result).toEqual({
        access_token: mockToken,
        user: mockUserResponse,
      });
      expect(service["jwtService"].signAsync).toHaveBeenCalled();
    });

    it("should throw error when JWT signing fails", async () => {
      const mockError = new Error("JWT signing failed!");
      (service["jwtService"].signAsync as Mock).mockRejectedValue(mockError);

      const mockUserResponse = new UserResponseDto(mockUser);

      await expect(service.login(mockUserResponse)).rejects.toThrow(
        new InternalServerErrorException("Something went wrong about login!")
      );
    });
  });

  describe("validateToken", () => {
    it("should validate token and return user", async () => {
      (usersService.findByUsername as Mock).mockResolvedValue(mockUser);

      const result = await service.validateToken({
        username: mockUser.username,
        sub: mockUser.id,
      });

      expect(result).toBeDefined();
      if (result) {
        expect(result.username).toBe(mockUser.username);
        expect(result.email).toBe(mockUser.email);
      }
      expect(usersService.findByUsername).toHaveBeenCalled();
    });

    it("should throw NotFoundException when user is not found in token validation", async () => {
      (usersService.findByUsername as Mock).mockResolvedValue(null);

      await expect(
        service.validateToken({
          username: "notExist",
          sub: 999,
        })
      ).rejects.toThrow(NotFoundException);

      expect(usersService.findByUsername).toHaveBeenCalled();
    });

    it("should throw InternalServerErrorException when an error in token validation", async () => {
      const dbError = new Error("Database connection failed!");
      (usersService.findByUsername as Mock).mockRejectedValue(dbError);

      await expect(
        service.validateToken({
          username: mockUser.username,
          sub: mockUser.id,
        })
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
