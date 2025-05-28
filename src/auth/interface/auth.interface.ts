import { IUser } from "../../users/interface/user.interface"

export interface IAuthPayload {
  username: string
  sub: number
}

export interface IAuthResponse {
  access_token: string
  user: IUser
}
