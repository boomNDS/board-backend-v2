import { IsString, MinLength, IsOptional } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class LoginDto {
  @ApiProperty({ example: "johnatan", required: false })
  @IsString()
  @IsOptional()
  username?: string

  @ApiProperty({ example: "john@example.com", required: false })
  @IsString()
  @IsOptional()
  email?: string

  @ApiProperty({ example: "securePassword" })
  @IsString()
  @MinLength(6)
  password: string
}
