import { Injectable } from "@nestjs/common"
import { Prisma, ScoreContractBlockchain } from "@prisma/client"

import { PrismaService } from "@src/prisma/prisma.service"

@Injectable()
export class ScoreContractBlockchainRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findByScoreIdAndBlockchainId(
    scoreId: number,
    blockchainId: number,
  ): Promise<ScoreContractBlockchain | null> {
    return this.prismaService.scoreContractBlockchain.findFirst({
      where: {
        score: {
          id: scoreId,
        },
        blockchain: {
          id: blockchainId,
        },
      },
      orderBy: {
        lastBlock: "desc",
      },
    })
  }

  public async create(args: Prisma.ScoreContractBlockchainCreateArgs): Promise<ScoreContractBlockchain | null> {
    const scoreContractBlockchain = await this.prismaService.scoreContractBlockchain.findFirst({
      where: {
        score: {
          id: args.data.score?.connect?.id,
        },
        contract: {
          id: args.data.contract?.connect?.id,
        },
        blockchain: {
          id: args.data.blockchain?.connect?.id,
        },
      },
    })

    if (scoreContractBlockchain) {
      return null
    }

    const newScoreContractBlockchain = await this.prismaService.scoreContractBlockchain.create(args)

    return newScoreContractBlockchain
  }
}
