import { Injectable } from "@nestjs/common"
import { Prisma, UserEvent } from "@prisma/client"

import { PrismaService } from "@src/prisma/prisma.service"

@Injectable()
export class UserEventRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async create(args: Prisma.UserEventCreateArgs): Promise<UserEvent | null> {
    const userEvent = await this.prismaService.userEvent.findFirst({
      where: {
        event: args.data.event,
        blockchain: args.data.blockchain,
        user: {
          id: args.data.user?.connect?.id,
        },
      },
    })

    if (userEvent) {
      return await this.prismaService.userEvent.update({
        where: {
          id: userEvent.id,
        },
        data: {
          value: userEvent.value + 1,
        },
      })
    }

    const newUserEvent = await this.prismaService.userEvent.create(args)

    return newUserEvent
  }

  public async findByUserSlug(slug: string): Promise<UserEvent | null> {
    return this.prismaService.userEvent.findFirst({
      where: {
        user: {
          slug,
        },
      },
      orderBy: {
        value: "desc",
      },
    })
  }
}
