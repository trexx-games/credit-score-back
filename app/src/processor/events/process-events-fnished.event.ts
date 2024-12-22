import { Wallet } from "@prisma/client";

export class ProcessEventsFinished {
  public constructor(public readonly wallets: Wallet[]) {}
}
