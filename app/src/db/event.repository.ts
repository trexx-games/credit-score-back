import { Injectable } from "@nestjs/common"
import { Event } from "@prisma/client"

import { PrismaService } from "@src/prisma/prisma.service"

@Injectable()
export class EventRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findManyByContractIds(contractIds: number[]): Promise<Event[]> {
    return this.prismaService.event.findMany({
      where: {
        contract: {
          id: {
            in: contractIds,
          },
        },
      },
    })
  }
}
