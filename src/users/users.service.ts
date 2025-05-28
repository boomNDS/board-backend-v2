import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
  ForbiddenException,
} from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { User } from "./entities/user.entity"
import * as bcrypt from "bcrypt"

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name)

  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, username, password } = createUserDto
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    })

    if (existingUser) {
      throw new ConflictException("Email or username already exists!")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    })

    return new User(user)
  }

  async findAll(): Promise<User[]> {
    const users = (await this.prisma.user.findMany()) || []
    return users.map((user) => new User(user))
  }

  async findOne(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      throw new NotFoundException(`User not found!`)
    }

    return new User(user)
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      return null
    }

    return new User(user)
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return null
    }

    return new User(user)
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    jwtUserId: number,
  ): Promise<User> {
    const { password } = updateUserDto
    const user = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      throw new NotFoundException(`User not found!`)
    }

    if (user.id !== jwtUserId) {
      throw new ForbiddenException("You can only update your own profile!")
    }

    if (password) {
      updateUserDto.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    })

    return new User(updatedUser)
  }

  async remove(id: number, jwtUserId: number): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      throw new NotFoundException(`User not found!`)
    }

    if (user.id !== jwtUserId) {
      throw new ForbiddenException("You can only delete your own profile!")
    }

    await this.prisma.user.delete({
      where: { id },
    })
  }
}
