import { Wallet } from "@prisma/client";

export class CreditScoreSaveOnBlockchainByProcessEventsFinishCommand {
  public constructor(public readonly wallets: Wallet[]) {}
}
