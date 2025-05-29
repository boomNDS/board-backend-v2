import { Comment as PrismaComment, User } from "@prisma/client";

export class Comment {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  postId: number;
  parentId?: number;
  user?: {
    id: number;
    username: string;
    email: string;
  };
  children?: Comment[];

  constructor(
    partial: Partial<
      PrismaComment & {
        user?: Pick<User, "id" | "username" | "email">;
        children?: Comment[];
      }
    >
  ) {
    Object.assign(this, partial);
  }
}
