import { Exclude } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IUser } from "../interfaces/user.interface";

export class User implements IUser {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: "john.doe@example.com" })
  email: string;

  @ApiProperty({ example: "johndoe" })
  username: string;

  @Exclude()
  password: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<IUser>) {
    Object.assign(this, partial);
  }
}
