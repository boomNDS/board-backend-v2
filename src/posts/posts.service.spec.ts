import { Test, TestingModule } from "@nestjs/testing"
import { PostsService } from "./posts.service"
import { describe, expect, it, beforeEach } from "vitest"
import { PrismaService } from "../prisma/prisma.service"
import { mockDeep, DeepMockProxy } from "vitest-mock-extended"
import { NotFoundException, ForbiddenException } from "@nestjs/common"
import { createMockUser } from "../users/factories/user.factory"
import { createMockPost } from "./factories/post.factory"
import { Community } from "./enums/community.enum"

describe("PostsService", () => {
  let service: PostsService
  let prismaService: DeepMockProxy<PrismaService>

  const mockUser = createMockUser()
  const mockPost = createMockPost({ userId: mockUser.id, user: mockUser })

  beforeEach(async () => {
    prismaService = mockDeep<PrismaService>()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile()

    service = module.get<PostsService>(PostsService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("create", () => {
    it("should create a post", async () => {
      const createPostDto = {
        title: "New Post",
        content: "This is a new post content",
        community: Community.HISTORY,
      }
      const userId = 1

      prismaService.post.create.mockResolvedValue(mockPost)

      const result = await service.create(createPostDto, userId)

      expect(prismaService.post.create).toHaveBeenCalled()
      expect(result).toBeInstanceOf(Object)
    })
  })

  describe("findAll", () => {
    it("should return an array of posts", async () => {
      const mockPosts = [createMockPost()]

      prismaService.post.findMany.mockResolvedValue(mockPosts)

      const result = await service.findAll({})

      expect(prismaService.post.findMany).toHaveBeenCalled()
      expect(result).toHaveLength(1)
      expect(result[0]).toBeInstanceOf(Object)
    })
  })

  describe("myPosts", () => {
    it("should return  user's posts", async () => {
      const mockPosts = [createMockPost()]

      prismaService.post.findMany.mockResolvedValue(mockPosts)

      const result = await service.myPosts({ userId: mockUser.id })

      expect(prismaService.post.findMany).toHaveBeenCalled()
      expect(result).toHaveLength(1)
      expect(result[0]).toBeInstanceOf(Object)
    })
  })

  describe("findOne", () => {
    it("should return a post", async () => {
      prismaService.post.findUnique.mockResolvedValue(mockPost)

      const result = await service.findOne(1)

      expect(prismaService.post.findUnique).toHaveBeenCalled()
      expect(result).toBeInstanceOf(Object)
    })

    it("should throw NotFoundException if post does not exist", async () => {
      prismaService.post.findUnique.mockResolvedValue(null)

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException)
    })
  })

  describe("update", () => {
    it("should update a post", async () => {
      const updatePostDto = {
        title: "Updated Post",
        content: "Updated content",
      }
      const userId = 1
      const mockUpdatedPost = createMockPost({
        ...updatePostDto,
        userId: mockUser.id,
      })

      prismaService.post.findUnique.mockResolvedValue(mockPost)
      prismaService.post.update.mockResolvedValue(mockUpdatedPost)

      const result = await service.update(1, updatePostDto, userId)

      expect(prismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      })
      expect(prismaService.post.update).toHaveBeenCalled()
      expect(result).toBeInstanceOf(Object)
    })

    it("should throw NotFoundException if post does not exist", async () => {
      const updatePostDto = {
        title: "Updated Post",
        content: "Updated content",
      }
      const userId = 1

      prismaService.post.findUnique.mockResolvedValue(null)

      await expect(service.update(1, updatePostDto, userId)).rejects.toThrow(
        NotFoundException,
      )
    })

    it("should throw ForbiddenException if user is not the owner", async () => {
      const updatePostDto = {
        title: "Updated Post",
        content: "Updated content",
      }
      const userId = 2
      const mockPost = createMockPost()

      prismaService.post.findUnique.mockResolvedValue(mockPost)

      await expect(service.update(1, updatePostDto, userId)).rejects.toThrow(
        ForbiddenException,
      )
    })
  })

  describe("remove", () => {
    it("should remove a post", async () => {
      const userId = 1

      prismaService.post.findUnique.mockResolvedValue(mockPost)
      prismaService.post.delete.mockResolvedValue(mockPost)

      await service.remove(1, userId)

      expect(prismaService.post.findUnique).toHaveBeenCalled()
      expect(prismaService.post.delete).toHaveBeenCalled()
    })

    it("should throw NotFoundException if post does not exist", async () => {
      const userId = 1

      prismaService.post.findUnique.mockResolvedValue(null)

      await expect(service.remove(1, userId)).rejects.toThrow(NotFoundException)
    })

    it("should throw ForbiddenException if user is not the owner", async () => {
      const userId = 2
      const mockPost = createMockPost()

      prismaService.post.findUnique.mockResolvedValue(mockPost)

      await expect(service.remove(1, userId)).rejects.toThrow(
        ForbiddenException,
      )
    })
  })
})
