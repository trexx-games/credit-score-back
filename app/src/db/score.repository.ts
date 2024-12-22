import { Injectable } from "@nestjs/common"
import { Prisma, Score } from "@prisma/client"

import { PrismaService } from "@src/prisma/prisma.service"

@Injectable()
export class ScoreRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findManyByUserIds(ids: number[]): Promise<Score[]> {
    return this.prismaService.score.findMany({
      where: {
        isActive: true,
        user: {
          id: {
            in: ids,
          },
        },
      },
    })
  }

  public async findActiveByUserIdOrThrow(userId: number): Promise<Score> {
    return this.prismaService.score.findFirstOrThrow({
      where: {
        isActive: true,
        user: {
          id: userId,
        },
      },
    })
  }

  public async findLastInactiveByUserId(userId: number): Promise<Score | null> {
    return this.prismaService.score.findFirst({
      where: {
        isActive: false,
        user: {
          id: userId,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  public async findLastActiveByUserId(userId: number): Promise<Score | null> {
    return this.prismaService.score.findFirst({
      where: {
        isActive: true,
        user: {
          id: userId,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  public async updateValueByIdOrThrow(id: number, value: number): Promise<Score> {
    return this.prismaService.score.update({
      where: {
        id: id,
      },
      data: {
        value: value,
      },
    })
  }

  public async create(args: Prisma.ScoreCreateArgs): Promise<Score> {
    await this.prismaService.score.updateMany({
      where: {
        isActive: true,
        user: {
          id: args.data.user!.connect!.id,
        },
      },
      data: {
        isActive: false,
      },
    })

    const score = await this.prismaService.score.create(args)

    return score
  }

  public async findAllByUserSlug(slug: string): Promise<Score[]> {
    return this.prismaService.score.findMany({
      where: {
        isActive: false,
        user: {
          slug,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    })
  }
}
