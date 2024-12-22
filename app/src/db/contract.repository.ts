import { Injectable } from "@nestjs/common"
import { Contact, ContactType, Contract } from "@prisma/client"

import { PrismaService } from "@src/prisma/prisma.service"

@Injectable()
export class ContractRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findByIdOrThrow(id: number): Promise<Contract> {
    return this.prismaService.contract.findUniqueOrThrow({
      where: {
        id: id,
      },
    })
  }

  public async findManyByBlockchainProtocolIds(blockchainProtocolIds: number[]): Promise<Contract[]> {
    return this.prismaService.contract.findMany({
      where: {
        blockchainProtocol: {
          id: {
            in: blockchainProtocolIds,
          },
        },
      },
    })
  }

  public async findManyActiveEmailByUserIds(userIds: number[]): Promise<Contact[]> {
    return this.prismaService.contact.findMany({
      where: {
        type: ContactType.Email,
        isActive: true,
        user: {
          id: {
            in: userIds,
          },
        },
      },
    })
  }

  public async findManyActivePhoneByUserIds(userIds: number[]): Promise<Contact[]> {
    return this.prismaService.contact.findMany({
      where: {
        type: ContactType.Phone,
        isActive: true,
        user: {
          id: {
            in: userIds,
          },
        },
      },
    })
  }
}
