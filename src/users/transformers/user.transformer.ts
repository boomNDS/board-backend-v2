import { Exclude, Expose, Transform } from "class-transformer"
import { IUser } from "../interface/user.interface"

@Exclude()
export class TUserResponse {
  @Expose()
  id: number

  @Expose()
  username: string

  @Expose()
  email: string

  @Exclude()
  password: string

  @Exclude()
  createdAt: Date

  @Exclude()
  updatedAt: Date

  constructor(user: IUser) {
    this.id = user.id
    this.username = user.username
    this.email = user.email
    this.createdAt = user.createdAt
    this.updatedAt = user.updatedAt
  }
}
