import { ApiProperty } from "@nestjs/swagger";
import { UserResponseDto } from "../../users/transformers/user.transformer";

export class AuthResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ type: String })
  access_token: string;
}
