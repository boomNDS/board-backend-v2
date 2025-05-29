import { Test, TestingModule } from "@nestjs/testing";
import { CommentsService } from "./comments.service";
import { PrismaService } from "../prisma/prisma.service";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { PostsService } from "../posts/posts.service";
import { mockDeep, DeepMockProxy } from "vitest-mock-extended";
import { NotFoundException, ForbiddenException } from "@nestjs/common";
import { createMockComment } from "./factories/comment.factory";
import { createMockPost } from "../posts/factories/post.factory";

describe("CommentsService", () => {
  let service: CommentsService;
  let prismaService: DeepMockProxy<PrismaService>;
  let postsService: DeepMockProxy<PostsService>;

  beforeEach(async () => {
    prismaService = mockDeep<PrismaService>();
    postsService = mockDeep<PostsService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
        {
          provide: PostsService,
          useValue: postsService,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a comment", async () => {
      const createCommentDto = {
        content: "Test comment",
        postId: 1,
        userId: "1",
      };
      const userId = 1;
      const mockPost = createMockPost();
      const mockComment = createMockComment();

      postsService.findOne.mockResolvedValue(mockPost);
      prismaService.comment.create.mockResolvedValue(mockComment);

      const result = await service.create(createCommentDto, userId);

      expect(postsService.findOne).toHaveBeenCalledWith(
        createCommentDto.postId
      );
      expect(prismaService.comment.create).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Object);
    });

    it("should throw NotFoundException if post does not exist", async () => {
      const createCommentDto = {
        content: "Test comment",
        postId: 1,
        userId: "1",
      };
      const userId = 1;

      postsService.findOne.mockRejectedValue(new NotFoundException());

      await expect(service.create(createCommentDto, userId)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe("update", () => {
    it("should update a comment successful", async () => {
      const updateCommentDto = {
        content: "Updated comment",
      };
      const userId = 1;
      const commentId = 1;
      const mockComment = createMockComment();
      const mockUpdatedComment = createMockComment({
        content: "Updated comment",
      });

      prismaService.comment.findUnique.mockResolvedValue(mockComment);
      prismaService.comment.update.mockResolvedValue(mockUpdatedComment);

      const result = await service.update(commentId, updateCommentDto, userId);

      expect(prismaService.comment.findUnique).toHaveBeenCalled();
      expect(prismaService.comment.update).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Object);
    });

    it("should throw NotFoundException if comment does not exist", async () => {
      const updateCommentDto = {
        content: "Updated comment",
      };
      const userId = 1;
      const commentId = 1;

      prismaService.comment.findUnique.mockResolvedValue(null);

      await expect(
        service.update(commentId, updateCommentDto, userId)
      ).rejects.toThrow(NotFoundException);
    });

    it("should throw ForbiddenException if user is not a owner", async () => {
      const updateCommentDto = {
        content: "Updated comment",
      };
      const userId = 2;
      const commentId = 1;
      const mockComment = createMockComment();

      prismaService.comment.findUnique.mockResolvedValue(mockComment);

      await expect(
        service.update(commentId, updateCommentDto, userId)
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe("remove", () => {
    it("should remove a comment successful", async () => {
      const userId = 1;
      const commentId = 1;
      const mockComment = createMockComment();

      prismaService.comment.findUnique.mockResolvedValue(mockComment);
      prismaService.comment.delete.mockResolvedValue(mockComment);

      await service.remove(commentId, userId);

      expect(prismaService.comment.findUnique).toHaveBeenCalled();
      expect(prismaService.comment.delete).toHaveBeenCalled();
    });

    it("should throw NotFoundException if comment does not exist", async () => {
      const userId = 1;
      const commentId = 1;

      prismaService.comment.findUnique.mockResolvedValue(null);

      await expect(service.remove(commentId, userId)).rejects.toThrow(
        NotFoundException
      );
    });

    it("should throw ForbiddenException if user is not a owner", async () => {
      const userId = 2;
      const commentId = 1;
      const mockComment = createMockComment();

      prismaService.comment.findUnique.mockResolvedValue(mockComment);

      await expect(service.remove(commentId, userId)).rejects.toThrow(
        ForbiddenException
      );
    });
  });
});
