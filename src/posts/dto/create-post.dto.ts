import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, MinLength } from "class-validator"

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
}
