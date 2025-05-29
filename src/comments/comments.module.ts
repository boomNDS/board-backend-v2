import { Module } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CommentsController } from "./comments.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { PostsModule } from "../posts/posts.module";

@Module({
  imports: [PrismaModule, PostsModule],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
