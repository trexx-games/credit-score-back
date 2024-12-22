import { BlockchainProtocolRepository } from "@src/db/blockchain-protocol.repository"
import { BlockchainRepository } from "@src/db/blockchain.repository"
import { ContactLoader } from "@src/db/contact.loader"
import { ContactRepository } from "@src/db/contact.repository"
import { ContractRepository } from "@src/db/contract.repository"
import { EventRepository } from "@src/db/event.repository"
import { ProtocolRepository } from "@src/db/protocol.repository"
import { ScanLoader } from "@src/db/scan.loader"
import { ScanRepository } from "@src/db/scan.repository"
import { ScoreContractBlockchainRepository } from "@src/db/score-contract-blockchain.repository"
import { ScoreLoader } from "@src/db/score.loader"
import { ScoreRepository } from "@src/db/score.repository"
import { UserRepository } from "@src/db/user.repository"
import { WalletLoader } from "@src/db/wallet.loader"
import { WalletRepository } from "@src/db/wallet.repository"
import { UserEventRepository } from "./user-event.repository"

const DbProvider = {
  BlockchainProtocolRepository,
  BlockchainRepository,
  ContactRepository,
  ContractRepository,
  EventRepository,
  ProtocolRepository,
  ScanLoader,
  ContactLoader,
  ScanRepository,
  ScoreContractBlockchainRepository,
  ScoreLoader,
  ScoreRepository,
  UserEventRepository,
  UserRepository,
  WalletLoader,
  WalletRepository,
}

const DbProviders = Object.values(DbProvider)

export { DbProvider, DbProviders }
