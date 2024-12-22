import { Blockchain, Wallet } from "@prisma/client"

export type StartJobType = {
  blockchain: Blockchain
  wallets: Wallet[]
}
