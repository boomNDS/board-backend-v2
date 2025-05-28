import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { IAuthPayload } from "../interface/auth.interface"
import { UsersService } from "../../users/users.service"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_SECRET") || "",
    })
  }

  async validate(payload: IAuthPayload) {
    const user = await this.usersService.findByUsername(payload.username)
    if (!user) {
      return null
    }
    return { id: payload.sub, username: payload.username }
  }
}
