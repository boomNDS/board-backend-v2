import { ApiProperty } from "@nestjs/swagger"
import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from "class-validator"
import { Community } from "../enums/community.enum"

export class CreatePostDto {
  @ApiProperty({ example: "My First Post" })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string

  @ApiProperty({ example: "This is the content of my first post" })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  content: string

  @ApiProperty({
    example: "history",
    enum: Community,
    default: Community.OTHERS,
  })
  @IsEnum(Community)
  @IsOptional()
  community: Community = Community.OTHERS
}
