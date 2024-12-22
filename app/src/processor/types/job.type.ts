import { Event, Wallet } from "@prisma/client"
import { EventLog, Log } from "ethers"

export type EventWalletJobType = {
  events: Event[]
  wallets: Wallet[]
}

export type EventLogJobType = {
  eventLog: Log | EventLog
  event: Event
  wallet: Wallet
}
