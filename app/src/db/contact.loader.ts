import { Injectable, Scope } from "@nestjs/common"
import { Contact } from "@prisma/client"
import { ContractRepository } from "@src/db/contract.repository"
import DataLoader from "dataloader"

@Injectable({ scope: Scope.REQUEST })
export class ContactLoader {
  public constructor(private readonly contactRepository: ContractRepository) {}

  public loadActiveEmailByUserId = new DataLoader<number, Contact>(async (ids) => {
    const nodes = await this.contactRepository.findManyActiveEmailByUserIds(ids.concat())
    return ids.map((id) => nodes.find((node) => node.userId === id) as Contact)
  })

  public loadActivePhoneByUserId = new DataLoader<number, Contact>(async (ids) => {
    const nodes = await this.contactRepository.findManyActivePhoneByUserIds(ids.concat())
    return ids.map((id) => nodes.find((node) => node.userId === id) as Contact)
  })
}
