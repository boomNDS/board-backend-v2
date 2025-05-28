import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { PrismaModule } from "./prisma/prisma.module"
import { validateEnv } from "./config/env.config"
import { HealthModule } from "./health/health.module"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { AuthModule } from "./auth/auth.module"
import { UsersModule } from "./users/users.module"
import { ProtectedModule } from "./protected/protected.module"
import { PostsService } from "./posts/posts.service"
import { PostsModule } from "./posts/posts.module"
import { CommentsModule } from "./comments/comments.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    ProtectedModule,
    PostsModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PostsService],
})
export class AppModule {}
