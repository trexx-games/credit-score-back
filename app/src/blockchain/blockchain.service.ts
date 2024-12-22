import { InjectQueue } from "@nestjs/bull"
import { Injectable, Logger, UnprocessableEntityException } from "@nestjs/common"
import trexxCreditScoreAbi from "@src/blockchain/abis/trexx-credit-score.abi.json"
import { Queue } from "bull"
import { ethers, InterfaceAbi } from "ethers"
import lodash from "lodash"

import { EventBus } from "@nestjs/cqrs"

import {
  BlockchainProtocolEventMappingType,
  EventArgsType,
  GetEventFilterArgsType,
  ProcessEventByChunkArgsType,
  VerifySignedMessageArgsType,
} from "@src/blockchain/types/blockchain.type"
import { BlockchainProtocolRepository } from "@src/db/blockchain-protocol.repository"
import { BlockchainRepository } from "@src/db/blockchain.repository"
import { ContractRepository } from "@src/db/contract.repository"
import { ProtocolRepository } from "@src/db/protocol.repository"
import { ScoreContractBlockchainRepository } from "@src/db/score-contract-blockchain.repository"
import { ScoreRepository } from "@src/db/score.repository"
import { EnvService } from "@src/env/env.service"
import { ProcessEventsFinished } from "@src/processor/events/process-events-fnished.event"
import { EventWalletJobType } from "@src/processor/types/job.type"
import { cfg } from "@src/utils/constants/cfg.constant"
import { UserEventRepository } from "@src/db/user-event.repository"

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name)

  public constructor(
    @InjectQueue(cfg.queues.creditScore) private queue: Queue,
    private readonly blockchainProtocolRepository: BlockchainProtocolRepository,
    private readonly blockchainRepository: BlockchainRepository,
    private readonly contractRepository: ContractRepository,
    private readonly envService: EnvService,
    private readonly eventBus: EventBus,
    private readonly protocolRepository: ProtocolRepository,
    private readonly scoreContractBlockchainRepository: ScoreContractBlockchainRepository,
    private readonly scoreRepository: ScoreRepository,
    private readonly userEventRepository: UserEventRepository,
  ) {}

  public async processEventsByWallets(args: EventWalletJobType): Promise<void> {
    const { events, wallets } = args

    try {
      for (const wallet of wallets) {
        const score = await this.scoreRepository.findActiveByUserIdOrThrow(wallet.userId)
        let finalScore = score.value

        for (const event of events) {
          const contract = await this.contractRepository.findByIdOrThrow(event.contractId)
          const blockchainProtocol = await this.blockchainProtocolRepository.findByIdOrThrow(
            contract.blockchainProtocolId,
          )
          const blockchain = await this.blockchainRepository.findByIdOrThrow(blockchainProtocol.blockchainId)
          const protocol = await this.protocolRepository.findByIdOrThrow(blockchainProtocol.protocolId)
          const provider = new ethers.JsonRpcProvider(blockchain.url)
          const abi = contract.abi as InterfaceAbi
          const contractEthers = new ethers.Contract(contract.address, abi, provider)
          const startBlock = await this.getStartBlock(wallet.userId, blockchain.id)
          const endBlock = await provider.getBlockNumber()

          const result = await this.processEventByChunk({
            wallet: wallet,
            block: { start: startBlock, end: endBlock },
            contractEthers: contractEthers,
            blockchain: blockchain,
            protocol: protocol,
            contract: contract,
            event: event,
            score: score,
          })

          finalScore = finalScore + result.partialScore

          await this.scoreRepository.updateValueByIdOrThrow(score.id, finalScore)
        }
      }
    } catch (error: any) {
      this.logger.error(error)
    }

    this.eventBus.publish(new ProcessEventsFinished(wallets))
  }

  private async processEventByChunk(args: ProcessEventByChunkArgsType) {
    const CHUNK_SIZE = 10000
    let partialScore = 0

    const totalBlockToProcess = Math.ceil((args.block.end - args.block.start) / CHUNK_SIZE)

    for (let i = 0; i < totalBlockToProcess; i++) {
      const chunkStartBlock = args.block.start + i * CHUNK_SIZE
      const chunkEndBlock = Math.min(chunkStartBlock + CHUNK_SIZE, args.block.end)

      const contractEventMap = this.getEventFilter({
        blockchain: args.blockchain,
        protocol: args.protocol,
        event: args.event,
      })

      const contractEvent = contractEventMap({
        walletAddress: args.wallet.address,
        contract: args.contractEthers,
      })

      const eventLogs = await args.contractEthers.queryFilter(contractEvent, chunkStartBlock, chunkEndBlock)

      const eventLogsWithoutTransactionHashRepeated = lodash.uniqBy(eventLogs, "transactionHash")

      partialScore = partialScore + eventLogsWithoutTransactionHashRepeated.length * args.event.weight

      await this.scoreContractBlockchainRepository.create({
        data: {
          lastBlock: chunkEndBlock,
          score: { connect: { id: args.score.id } },
          contract: { connect: { id: args.contract.id } },
          blockchain: { connect: { id: args.blockchain.id } },
        },
      })

      await this.userEventRepository.create({
        data: {
          value: eventLogsWithoutTransactionHashRepeated.length,
          event: args.event.name,
          user: { connect: { id: args.wallet.userId } },
          blockchain: args.blockchain.name,
        },
      })

      const eventLogsJobs = eventLogsWithoutTransactionHashRepeated.map((eventLog: any) => ({
        name: cfg.jobs.eventLog,
        data: {
          eventLog: eventLog,
          event: args.event,
          wallet: args.wallet,
        },
      }))

      this.queue.addBulk(eventLogsJobs)
    }

    return { partialScore: partialScore }
  }

  private async getStartBlock(userId: number, blockchainId: number): Promise<number> {
    const score = await this.scoreRepository.findLastInactiveByUserId(userId)

    const scoreContract = score
      ? await this.scoreContractBlockchainRepository.findByScoreIdAndBlockchainId(score.id, blockchainId)
      : undefined

    const startBlock = scoreContract ? scoreContract.lastBlock : 0

    return startBlock
  }

  public async saveScoreOnBlockchain(userSlug: string, walletAddresses: string[], score: number): Promise<void> {
    try {
      const provider = new ethers.JsonRpcProvider(this.envService.TREXX_BLOCKCHAIN_URL)
      const wallet = new ethers.Wallet(this.envService.TREXX_WALLET_KEY, provider)
      const contractEthers = new ethers.Contract(
        this.envService.TREXX_CREDIT_SCORE_CONTRACT,
        trexxCreditScoreAbi,
        wallet,
      )
      const timestamp = Math.floor(new Date().getTime() / 1000)
      await contractEthers.registerScore(userSlug, walletAddresses, score, timestamp)
    } catch (error) {
      console.log(error)
    }
  }

  public async verifySignedMessage(args: VerifySignedMessageArgsType): Promise<boolean> {
    const { message, signature, walletAddress } = args

    const recoveredAddress = ethers.verifyMessage(message, signature)
    const isTheSameWallet = recoveredAddress.toLowerCase() === walletAddress.toLowerCase()

    return isTheSameWallet
  }

  /**
   * Return the event filtered based on event name
   *
   * @param {GetEventFilterArgs} args Arguments
   * @return {(args: EventArgs) => any} Event filter
   * @see Docs [Link to see more details](../../docs/event.doc.md)
   *
   */

  private getEventFilter(args: GetEventFilterArgsType): (args: EventArgsType) => any {
    // prettier-ignore
    const mapping: BlockchainProtocolEventMappingType = {
      Ethereum: {
        Lido: {
          Submitted: (args: EventArgsType) => args.contract.filters.Submitted(args.walletAddress),
          WithdrawalClaimed: (args: EventArgsType) => args.contract.filters.WithdrawalClaimed(null, args.walletAddress),
        },
        Curve: {
          AddLiquidity: (args: EventArgsType) => args.contract.filters.AddLiquidity(args.walletAddress),
          TokenExchange: (args: EventArgsType) => args.contract.filters.TokenExchange(args.walletAddress),
          RemoveLiquidityOne: (args: EventArgsType) => args.contract.filters.RemoveLiquidityOne(args.walletAddress),
          RemoveLiquidity: (args: EventArgsType) => args.contract.filters.RemoveLiquidity(args.walletAddress),
        },
        Compound: {
          Withdraw: (args: EventArgsType) => args.contract.filters.Withdraw(null, args.walletAddress),
          Supply: (args: EventArgsType) => args.contract.filters.Supply(null, args.walletAddress),
          SupplyCollateral: (args: EventArgsType) => args.contract.filters.SupplyCollateral(null, args.walletAddress),
          WithdrawCollateral: (args: EventArgsType) => args.contract.filters.WithdrawCollateral(null, args.walletAddress),
        },
        Aave: {
          Withdraw: (args: EventArgsType) => args.contract.filters.Withdraw(null, args.walletAddress),
          Repay: (args: EventArgsType) => args.contract.filters.Repay(null, args.walletAddress),
        },
        Uniswap: {
        },
      },
      Polygon: {
        Compound: {
          Withdraw: (args: EventArgsType) => args.contract.filters.Withdraw(null, args.walletAddress),
          SupplyCollateral: (args: EventArgsType) => args.contract.filters.SupplyCollateral(null, args.walletAddress),
          WithdrawCollateral: (args: EventArgsType) => args.contract.filters.WithdrawCollateral(null, args.walletAddress),
        },
        Aave: {
          Withdraw: (args: EventArgsType) => args.contract.filters.Withdraw(null, args.walletAddress),
          Repay: (args: EventArgsType) => args.contract.filters.Repay(null, args.walletAddress),
        },
        Uniswap: {
        },
        TheSandbox: {
          Transfer: (args: EventArgsType) => args.contract.filters.Transfer(null, args.walletAddress),
          Staked: (args: EventArgsType) => args.contract.filters.Staked(args.walletAddress),
          Withdrawn: (args: EventArgsType) => args.contract.filters.Withdrawn(args.walletAddress),
        },
      },
      Ronin: {
        Katana: {
          Mint: (args: EventArgsType) => args.contract.filters.Mint(args.walletAddress),
          Burn: (args: EventArgsType) => args.contract.filters.Burn(args.walletAddress),
        },
        AxieInfinity: {
          Staked: (args: EventArgsType) => args.contract.filters.Staked(args.walletAddress),
          Unstaked: (args: EventArgsType) => args.contract.filters.Unstaked(args.walletAddress),
          AgreementTerminated: (args: EventArgsType) => args.contract.filters.AgreementTerminated(args.walletAddress),
          AgreementSubmitted: (args: EventArgsType) => args.contract.filters.AgreementSubmitted(args.walletAddress),
          AgreementExtended: (args: EventArgsType) => args.contract.filters.AgreementExtended(args.walletAddress),
          Transfer: (args: EventArgsType) => args.contract.filters.Transfer(null, args.walletAddress),
        },
        Pixels: {
          Transfer: (args: EventArgsType) => args.contract.filters.Transfer(null, args.walletAddress),
        },
        Metalend: {
        },
      },
      XRPL: {
        XRPToken: {
          // Eventos reais para um contrato de token ERC-20 no XRPL EVM
          Transfer: (args: EventArgsType) =>
            args.contract.filters.Transfer(args.walletAddress, null), // Transferência de tokens (from, to)
          Approval: (args: EventArgsType) =>
            args.contract.filters.Approval(args.walletAddress, null), // Aprovação de um gasto de tokens
          Mint: (args: EventArgsType) =>
            args.contract.filters.Mint(args.walletAddress, null), // Cunhagem de tokens
          Burn: (args: EventArgsType) =>
            args.contract.filters.Burn(args.walletAddress, null), // Queima de tokens
        },
        DecentralizedExchange: {
          // Eventos relacionados a uma DEX implementada na EVM sidechain
          Swap: (args: EventArgsType) =>
            args.contract.filters.Swap(args.walletAddress, null), // Swap de tokens
          AddLiquidity: (args: EventArgsType) =>
            args.contract.filters.AddLiquidity(args.walletAddress), // Adicionar liquidez
          RemoveLiquidity: (args: EventArgsType) =>
            args.contract.filters.RemoveLiquidity(args.walletAddress), // Remover liquidez
        },
      },
    }

    const blockchain = mapping[args.blockchain.name]

    if (!blockchain) {
      throw new UnprocessableEntityException("Blockchain not supported")
    }

    const protocol = blockchain[args.protocol.name]

    if (!protocol) {
      throw new UnprocessableEntityException("Protocol not supported")
    }

    const event = protocol[args.event.name]

    if (!event) {
      throw new UnprocessableEntityException("Event not supported")
    }

    return event
  }
}
