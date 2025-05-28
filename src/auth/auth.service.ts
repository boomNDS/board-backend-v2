import {
  Injectable,
  UnauthorizedException,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { TUserResponse } from "../users/transformers/user.transformer";
import { IAuthPayload, IAuthResponse } from "./interface/auth.interface";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(loginDto: LoginDto): Promise<TUserResponse> {
    try {
      let user: User | null = null;
      const { username, email, password } = loginDto;
      if (username) {
        user = await this.usersService.findByUsername(username);
      } else if (email) {
        user = await this.usersService.findByEmail(email);
      }

      if (!user) {
        throw new NotFoundException("User not found!");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException("Invalid password!");
      }

      return new TUserResponse(user);
    } catch (error) {
      this.logger.error("Error validating user:", error.message, error.stack);
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new InternalServerErrorException("Error validating user!");
    }
  }

  async login(user: TUserResponse): Promise<IAuthResponse> {
    try {
      const payload: IAuthPayload = {
        username: user.username,
        sub: user.id,
      };
      const access_token = await this.jwtService.signAsync(payload);
      return {
        access_token,
        user,
      };
    } catch (error) {
      this.logger.error(
        "Error generating JWT token:",
        error.message,
        error.stack
      );
      throw new InternalServerErrorException(
        "Something went wrong about login!"
      );
    }
  }

  async validateToken(payload: IAuthPayload): Promise<TUserResponse> {
    try {
      const user = await this.usersService.findByUsername(payload.username);

      if (!user) {
        throw new NotFoundException("User not found!");
      }

      return new TUserResponse(user);
    } catch (error) {
      this.logger.error("Error validating token:", error.message, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Something went wrong about token validation!"
      );
    }
  }
}
