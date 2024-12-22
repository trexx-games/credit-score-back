import { Injectable } from "@nestjs/common"
import { BlockchainProtocol } from "@prisma/client"

import { PrismaService } from "@src/prisma/prisma.service"

@Injectable()
export class BlockchainProtocolRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findByIdOrThrow(id: number): Promise<BlockchainProtocol> {
    return this.prismaService.blockchainProtocol.findUniqueOrThrow({
      where: {
        id: id,
      },
    })
  }

  public async findManyByBlockchainId(blockchainId: number): Promise<BlockchainProtocol[]> {
    return this.prismaService.blockchainProtocol.findMany({
      where: {
        blockchain: {
          id: blockchainId,
        },
      },
    })
  }
}
