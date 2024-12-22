import { Blockchain, Contract, Event, Protocol, Score, Wallet } from "@prisma/client"
import { ethers } from "ethers"

export type GetEventFilterArgsType = {
  blockchain: Blockchain
  protocol: Protocol
  event: Event
}

export type EventArgsType = {
  walletAddress: string
  contract: ethers.Contract
}

export type BlockchainProtocolEventMappingType = {
  [blockchain: string]: {
    [protocol: string]: {
      [event: string]: (args: EventArgsType) => any
    }
  }
}

export type VerifySignedMessageArgsType = {
  message: string
  signature: string
  walletAddress: string
}

export type ProcessEventByChunkArgsType = {
  block: { start: number; end: number }
  contractEthers: ethers.Contract
  blockchain: Blockchain
  protocol: Protocol
  contract: Contract
  event: Event
  score: Score
  wallet: Wallet
}
