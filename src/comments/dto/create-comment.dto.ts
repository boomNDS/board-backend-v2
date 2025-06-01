import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  IsOptional,
  IsNumber,
} from "class-validator";

export class CreateCommentDto {
  @ApiProperty({ example: "This is a comment." })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ example: "2" })
  @IsNotEmpty()
  @IsNumber()
  postId: number;

  @ApiProperty({ example: "", required: false })
  @IsOptional()
  @IsNumberString()
  parentId?: string;
}
