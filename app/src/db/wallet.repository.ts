import { Injectable } from "@nestjs/common"
import { Prisma, Wallet } from "@prisma/client"

import { PrismaService } from "@src/prisma/prisma.service"

@Injectable()
export class WalletRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findFirstByAddress(address: string): Promise<Wallet | null> {
    return this.prismaService.wallet.findFirst({
      where: {
        address: address,
      },
    })
  }

  public async findManyByUserIds(ids: number[]): Promise<Wallet[]> {
    return this.prismaService.wallet.findMany({
      where: {
        user: {
          id: {
            in: ids,
          },
        },
      },
    })
  }

  public async findManyActiveByUserIdOrThrow(userId: number): Promise<Wallet[]> {
    return this.prismaService.wallet.findMany({
      where: {
        isActive: true,
        user: {
          id: userId,
        },
      },
    })
  }

  public async create(args: Prisma.WalletCreateArgs): Promise<Wallet> {
    return this.prismaService.wallet.create(args)
  }
}
