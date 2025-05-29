import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { Comment } from "./entities/comment.entity";
import { PostsService } from "../posts/posts.service";

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private postsService: PostsService
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    userId: number
  ): Promise<Comment> {
    const { content, postId } = createCommentDto;

    await this.postsService.findOne(postId);

    const comment = await this.prisma.comment.create({
      data: {
        content,
        userId,
        postId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        postId: true,
        parentId: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return new Comment(comment);
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
    userId: number
  ): Promise<Comment> {
    const { content } = updateCommentDto;
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException(`Comment not found!`);
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException("You can only update your own comments!");
    }

    const updatedComment = await this.prisma.comment.update({
      where: { id },
      data: { content },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        postId: true,
        parentId: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return new Comment(updatedComment);
  }

  async remove(id: number, userId: number): Promise<void> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException(`Comment not found!`);
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException("You can only delete your own comments!");
    }

    await this.prisma.comment.delete({
      where: { id },
    });
  }
}
