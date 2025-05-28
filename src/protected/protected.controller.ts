import { Controller, Get, UseGuards, Request } from "@nestjs/common"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"
import { TUserResponse } from "../users/transformers/user.transformer"

@ApiTags("protected")
@ApiBearerAuth("JWT-auth")
@Controller("protected")
export class ProtectedController {
  @Get("hello")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Protected route" })
  getHello(@Request() req) {
    const user = new TUserResponse(req.user)
    return {
      message: "Hello World!",
      user: user,
    }
  }
}
