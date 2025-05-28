import { Test, TestingModule } from "@nestjs/testing"
import { PostsService } from "./posts.service"
import { describe, expect, it, beforeEach, vi } from "vitest"
import { PrismaService } from "../prisma/prisma.service"
import { NotFoundException, ForbiddenException } from "@nestjs/common"
import { CreatePostDto } from "./dto/create-post.dto"
import { createMockUser } from "../users/factories/user.factory"
import { createMockPost } from "./factories/post.factory"

describe("PostsService", () => {
  let service: PostsService

  const mockUser = createMockUser()
  const mockPost = createMockPost({ userId: mockUser.id, user: mockUser })

  const mockPrismaService = {
    post: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findMany: vi.fn(),
    },
    comment: {
      findMany: vi.fn(),
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile()

    service = module.get<PostsService>(PostsService)
    vi.clearAllMocks()
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("create", () => {
    it("should create a new post", async () => {
      const createPostDto: CreatePostDto = {
        title: "New Post",
        content: "This is a new post content",
      }

      const expectedPost = createMockPost({
        ...createPostDto,
        userId: mockUser.id,
      })

      mockPrismaService.post.create.mockResolvedValue(expectedPost)

      const result = await service.create(createPostDto, mockUser.id)

      expect(result).toBeDefined()
      expect(result.title).toBe(createPostDto.title)
      expect(result.content).toBe(createPostDto.content)
      expect(mockPrismaService.post.create).toHaveBeenCalled()
    })
  })

  describe("findAll", () => {
    it("should return an array of posts", async () => {
      const posts = [mockPost]
      mockPrismaService.post.findMany.mockResolvedValue(posts)

      const result = await service.findAll()

      expect(result).toEqual(posts)
      expect(mockPrismaService.post.findMany).toHaveBeenCalled()
    })

    it("should return empty array when no posts exist", async () => {
      mockPrismaService.post.findMany.mockResolvedValue([])

      const result = await service.findAll()

      expect(result).toEqual([])
      expect(mockPrismaService.post.findMany).toHaveBeenCalled()
    })
  })

  describe("findOne", () => {
    it("should return a post by id", async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost)

      const result = await service.findOne(1)

      expect(result).toEqual(mockPost)
      expect(mockPrismaService.post.findUnique).toHaveBeenCalled()
    })

    it("should throw NotFoundException if post not found", async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null)

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException)
    })
  })

  describe("update", () => {
    it("should update a post when user id is owner", async () => {
      const updatePostDto = {
        title: "Updated Post",
      }

      const expectedPost = createMockPost({
        ...updatePostDto,
        userId: mockUser.id,
      })

      mockPrismaService.post.findUnique.mockResolvedValue(mockPost)
      mockPrismaService.post.update.mockResolvedValue(expectedPost)

      const result = await service.update(1, updatePostDto, mockUser.id)

      expect(result).toBeDefined()
      expect(result.title).toBe(updatePostDto.title)
      expect(mockPrismaService.post.update).toHaveBeenCalled()
    })

    it("should throw ForbiddenException when user id is not owner", async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost)

      await expect(service.update(1, {}, 999)).rejects.toThrow(
        ForbiddenException,
      )
      expect(mockPrismaService.post.update).not.toHaveBeenCalled()
    })

    it("should throw NotFoundException if post not found", async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null)

      await expect(service.update(999, {}, 999)).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe("remove", () => {
    it("should remove a post when user id is owner", async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost)
      mockPrismaService.post.delete.mockResolvedValue(mockPost)

      await service.remove(1, mockUser.id)

      expect(mockPrismaService.post.delete).toHaveBeenCalled()
    })

    it("should throw ForbiddenException when user id is not owner", async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost)

      await expect(service.remove(1, 999)).rejects.toThrow(ForbiddenException)
      expect(mockPrismaService.post.delete).not.toHaveBeenCalled()
    })

    it("should throw NotFoundException if post not found", async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null)

      await expect(service.remove(999, 999)).rejects.toThrow(NotFoundException)
    })
  })
})
