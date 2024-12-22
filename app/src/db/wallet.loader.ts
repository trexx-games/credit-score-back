import { Injectable, Scope } from "@nestjs/common"
import { Wallet } from "@prisma/client"
import { WalletRepository } from "@src/db/wallet.repository"
import DataLoader from "dataloader"

@Injectable({ scope: Scope.REQUEST })
export class WalletLoader {
  public constructor(private readonly walletRepository: WalletRepository) {}

  public loadManyByUserId = new DataLoader<number, Wallet[]>(async (ids) => {
    const nodes = await this.walletRepository.findManyByUserIds(ids.concat())
    return ids.map((id) => nodes.filter((node) => node.userId === id))
  })
}
