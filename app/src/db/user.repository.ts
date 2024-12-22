import { Injectable } from "@nestjs/common"
import { Prisma, User } from "@prisma/client"

import { PrismaService } from "@src/prisma/prisma.service"

@Injectable()
export class UserRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findByIdOrThrow(id: number): Promise<User> {
    return this.prismaService.user.findUniqueOrThrow({
      where: {
        id: id,
      },
    })
  }

  public async findBySlugOrThrow(slug: string): Promise<User> {
    return this.prismaService.user.findUniqueOrThrow({
      where: {
        slug: slug,
      },
    })
  }

  public async create(args: Prisma.UserCreateArgs): Promise<User> {
    return this.prismaService.user.create(args)
  }
}
