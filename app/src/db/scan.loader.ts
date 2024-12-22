import { Injectable, Scope } from "@nestjs/common"
import { Scan } from "@prisma/client"
import { ScanRepository } from "@src/db/scan.repository"
import DataLoader from "dataloader"

@Injectable({ scope: Scope.REQUEST })
export class ScanLoader {
  public constructor(private readonly scanRepository: ScanRepository) {}

  public loadManyByWalletId = new DataLoader<number, Scan[]>(async (ids) => {
    const nodes = await this.scanRepository.findManyByWalletIds(ids.concat())
    return ids.map((id) => nodes.filter((node) => node.walletId === id))
  })
}
