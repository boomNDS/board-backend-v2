import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { CreatePostDto } from "./dto/create-post.dto"
import { UpdatePostDto } from "./dto/update-post.dto"
import { Post } from "./entities/post.entity"

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto, userId: number): Promise<Post> {
    const { title, content } = createPostDto

    const post = await this.prisma.post.create({
      data: {
        title,
        content,
        userId,
      },
    })

    return post
  }

  async findAll(): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    })
    return posts.map((post) => new Post(post))
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                username: true,
              },
            },
            children: {
              select: {
                id: true,
                content: true,
                createdAt: true,
                user: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
              },
              orderBy: {
                createdAt: "desc",
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!post) {
      throw new NotFoundException(`Post not found!`)
    }

    return new Post(post)
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    userId: number,
  ): Promise<Post> {
    const { title, content } = updatePostDto
    const post = await this.prisma.post.findUnique({
      where: { id },
    })

    if (!post) {
      throw new NotFoundException(`Post not found!`)
    }

    if (post.userId !== userId) {
      throw new ForbiddenException("You can only update your own posts!")
    }

    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: { title, content },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    })

    return new Post(updatedPost)
  }

  async remove(id: number, userId: number): Promise<void> {
    const post = await this.prisma.post.findUnique({
      where: { id },
    })

    if (!post) {
      throw new NotFoundException(`Post not found!`)
    }

    if (post.userId !== userId) {
      throw new ForbiddenException("You can only delete your own posts!")
    }

    await this.prisma.post.delete({
      where: { id },
    })
  }
}
