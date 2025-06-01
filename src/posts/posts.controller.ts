import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  Request,
} from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { Post as PostEntity } from "./entities/post.entity";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("posts")
@ApiTags("protected")
@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Create a new post" })
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: "Post created successful",
    type: PostEntity,
  })
  create(
    @Body() createPostDto: CreatePostDto,
    @Request() req
  ): Promise<PostEntity> {
    return this.postsService.create(createPostDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: "Get all posts" })
  @ApiResponse({
    status: 200,
    description: "Return all posts",
    type: [PostEntity],
  })
  findAll(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }

  @Get("me")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get all my posts" })
  @ApiResponse({
    status: 200,
    description: "Return all my posts",
    type: [PostEntity],
  })
  myPosts(@Request() req): Promise<PostEntity[]> {
    return this.postsService.myPosts(req.user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a post by id" })
  @ApiResponse({
    status: 200,
    description: "Return the post",
    type: PostEntity,
  })
  findOne(@Param("id") id: string): Promise<PostEntity> {
    return this.postsService.findOne(+id);
  }

  @Patch(":id")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Update a post" })
  @ApiResponse({
    status: 200,
    description: "Post updated successful",
    type: PostEntity,
  })
  update(
    @Param("id") id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req
  ): Promise<PostEntity> {
    return this.postsService.update(+id, updatePostDto, req.user.id);
  }

  @Delete(":id")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Delete a post" })
  @ApiResponse({ status: 200, description: "Post deleted successful" })
  remove(@Param("id") id: string, @Request() req): Promise<void> {
    return this.postsService.remove(+id, req.user.id);
  }
}
