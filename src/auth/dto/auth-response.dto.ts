import { ApiProperty } from "@nestjs/swagger";
import { TUserResponse } from "../../users/transformers/user.transformer";

export class AuthResponseDto {
  @ApiProperty({ type: TUserResponse })
  user: TUserResponse;

  @ApiProperty({ type: String })
  access_token: string;
}
