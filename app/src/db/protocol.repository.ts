import { Injectable } from "@nestjs/common"
import { Protocol } from "@prisma/client"

import { PrismaService } from "@src/prisma/prisma.service"

@Injectable()
export class ProtocolRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findByIdOrThrow(id: number): Promise<Protocol> {
    return this.prismaService.protocol.findUniqueOrThrow({
      where: {
        id: id,
      },
    })
  }
}
