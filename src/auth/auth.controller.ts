import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common"
import { AuthService } from "./auth.service"
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger"
import { LoginDto } from "./dto/login.dto"
import { AuthResponseDto } from "./dto/auth-response.dto"
import { IAuthResponse } from "./interface/auth.interface"

@ApiTags("auth")
@ApiBearerAuth("JWT-auth")
@Controller("auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name)

  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @ApiOperation({ summary: "Login user with username or email" })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async login(@Body() loginDto: LoginDto): Promise<IAuthResponse> {
    const user = await this.authService.validateUser(loginDto)
    const response = await this.authService.login(user)

    return response
  }
}
