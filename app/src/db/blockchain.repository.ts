import { Injectable } from "@nestjs/common"
import { Blockchain } from "@prisma/client"

import { PrismaService } from "@src/prisma/prisma.service"

@Injectable()
export class BlockchainRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findByIdOrThrow(id: number): Promise<Blockchain> {
    return this.prismaService.blockchain.findUniqueOrThrow({
      where: {
        id: id,
      },
    })
  }

  public async findManyActive(): Promise<Blockchain[]> {
    return this.prismaService.blockchain.findMany({
      where: {
        isActive: true,
      },
    })
  }
}
