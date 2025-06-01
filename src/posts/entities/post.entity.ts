import { ApiProperty } from "@nestjs/swagger";
import { IPost } from "../interfaces/post.interface";
import { Community } from "../enums/community.enum";

export class Post implements IPost {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: "My First Post" })
  title: string;

  @ApiProperty({ example: "This is the content of my first post" })
  content: string;

  @ApiProperty({ example: "history", enum: Community })
  community!: Community;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: "2024-03-20T12:00:00Z" })
  createdAt: Date;

  @ApiProperty({ example: "2024-03-20T12:00:00Z" })
  updatedAt: Date;

  @ApiProperty({ example: 1 })
  user?: {
    id: number;
    username: string;
    email: string;
  };

  constructor(partial: Partial<IPost>) {
    Object.assign(this, partial);
  }
}
