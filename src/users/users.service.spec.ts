import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { PrismaService } from "../prisma/prisma.service";
import {
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "./dto/create-user.dto";
import { createMockUser } from "./factories/user.factory";

vi.mock("bcrypt", () => ({
  hash: vi.fn(),
}));

describe("UsersService", () => {
  let service: UsersService;

  const mockUser = createMockUser();

  const mockPrismaService = {
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findMany: vi.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const createUserDto: CreateUserDto = {
        username: "newuser",
        email: "new@example.com",
        password: "password123",
      };

      (bcrypt.hash as any).mockResolvedValue("hashedPassword");
      mockPrismaService.user.findFirst.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        ...mockUser,
        ...createUserDto,
        password: "hashedPassword",
      });

      const result = await service.create(createUserDto);

      expect(result).toBeDefined();
      expect(result.username).toBe(createUserDto.username);
      expect(result.email).toBe(createUserDto.email);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...createUserDto,
          password: "hashedPassword",
        },
      });
    });

    it("should throw ConflictException if user already exists", async () => {
      const createUserDto: CreateUserDto = {
        username: "existinguser",
        email: "existing@example.com",
        password: "password123",
      };

      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException
      );
    });
  });

  describe("findAll", () => {
    it("should return an array of users", async () => {
      const users = [mockUser];
      mockPrismaService.user.findMany.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(mockPrismaService.user.findMany).toHaveBeenCalled();
    });

    it("should return empty array when no users exist", async () => {
      mockPrismaService.user.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockPrismaService.user.findMany).toHaveBeenCalled();
    });
  });

  describe("findOne", () => {
    it("should return a user by id", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should throw NotFoundException if user not found", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe("findByUsername", () => {
    it("should return a user by username", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findByUsername("testuser");

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username: "testuser" },
      });
    });

    it("should return null if user not found", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findByUsername("notExist");

      expect(result).toBeNull();
    });
  });

  describe("findByEmail", () => {
    it("should return a user by email", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findByEmail("test@example.com");

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
    });

    it("should return null if user not found", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findByEmail("notExist@example.com");

      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("should update a user when JWT user matches", async () => {
      const updateUserDto = {
        username: "updateduser",
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue({
        ...mockUser,
        ...updateUserDto,
      });

      const result = await service.update(1, updateUserDto, 1);

      expect(result).toBeDefined();
      expect(result.username).toBe(updateUserDto.username);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateUserDto,
      });
    });

    it("should throw ForbiddenException when user id doesn't match", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.update(1, {}, 999)).rejects.toThrow(
        ForbiddenException
      );
      expect(mockPrismaService.user.update).not.toHaveBeenCalled();
    });

    it("should hash password if included in update", async () => {
      const updateUserDto = {
        password: "hashedNewPassword",
      };

      (bcrypt.hash as any).mockResolvedValue("hashedNewPassword");
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue({
        ...mockUser,
        password: "hashedNewPassword",
      });

      const result = await service.update(1, updateUserDto, 1);

      expect(result).toBeDefined();
      expect(bcrypt.hash).toHaveBeenCalledWith(updateUserDto.password, 10);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { password: "hashedNewPassword" },
      });
    });

    it("should throw NotFoundException if user not found", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.update(999, {}, 999)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe("remove", () => {
    it("should remove a user when user id matches", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.delete.mockResolvedValue(mockUser);

      await service.remove(1, 1);

      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should throw ForbiddenException when user id doesn't match", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.remove(1, 999)).rejects.toThrow(ForbiddenException);
      expect(mockPrismaService.user.delete).not.toHaveBeenCalled();
    });

    it("should throw NotFoundException if user not found", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.remove(999, 999)).rejects.toThrow(NotFoundException);
    });
  });
});
