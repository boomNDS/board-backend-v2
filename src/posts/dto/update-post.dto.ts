import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsOptional, IsEnum } from "class-validator"
import { Community } from "../enums/community.enum"

export class UpdatePostDto {
  @ApiProperty({ example: "Updated Post Title", required: false })
  @IsString()
  @IsOptional()
  title?: string

  @ApiProperty({ example: "Updated post content", required: false })
  @IsString()
  @IsOptional()
  content?: string

  @ApiProperty({ example: "food", enum: Community, required: false })
  @IsEnum(Community)
  @IsOptional()
  community?: Community
}
