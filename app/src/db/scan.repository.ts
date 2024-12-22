import { Injectable, Logger } from "@nestjs/common"
import { Prisma, Scan } from "@prisma/client"

import { PrismaService } from "@src/prisma/prisma.service"

@Injectable()
export class ScanRepository {
  private readonly logger = new Logger(ScanRepository.name)

  public constructor(private readonly prismaService: PrismaService) {}

  public async findManyByWalletIds(ids: number[]): Promise<Scan[]> {
    return this.prismaService.scan.findMany({
      where: {
        wallet: {
          id: {
            in: ids,
          },
        },
      },
    })
  }

  public async findManyByEventIds(ids: number[]): Promise<Scan[]> {
    return this.prismaService.scan.findMany({
      where: {
        event: {
          id: {
            in: ids,
          },
        },
      },
    })
  }

  public async create(args: Prisma.ScanCreateArgs): Promise<Scan | null> {
    const { transactionHash, wallet } = args.data
    const walletId = wallet!.connect!.id

    const scan = await this.prismaService.scan.findFirst({
      where: {
        transactionHash: transactionHash,
        wallet: {
          id: walletId,
        },
      },
    })

    if (scan) {
      this.logger.warn(`Transaction hash "${transactionHash}" already exists for wallet id ${walletId}`)

      return null
    }

    const newScan = await this.prismaService.scan.create(args)

    return newScan
  }
}
