import { Injectable } from "@nestjs/common"
import { Contact, Prisma } from "@prisma/client"

import { PrismaService } from "@src/prisma/prisma.service"

@Injectable()
export class ContactRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findFirstActiveByValue(value: string): Promise<Contact | null> {
    return this.prismaService.contact.findFirst({
      where: {
        isActive: true,
        value: value,
      },
    })
  }

  public async findFirstActiveByValueOrThrow(value: string): Promise<Contact> {
    return this.prismaService.contact.findFirstOrThrow({
      where: {
        isActive: true,
        value: value,
      },
    })
  }

  public async create(args: Prisma.ContactCreateArgs): Promise<Contact> {
    return this.prismaService.contact.create(args)
  }
}
