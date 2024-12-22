import { InjectQueue, OnQueueEvent, Process, Processor } from "@nestjs/bull"
import { Logger } from "@nestjs/common"
import { Job, Queue } from "bull"

import { BlockchainService } from "@src/blockchain/blockchain.service"
import { BlockchainProtocolRepository } from "@src/db/blockchain-protocol.repository"
import { ContractRepository } from "@src/db/contract.repository"
import { EventRepository } from "@src/db/event.repository"
import { ScanRepository } from "@src/db/scan.repository"
import { EventLogJobType, EventWalletJobType } from "@src/processor/types/job.type"
import { StartJobType } from "@src/public-credit-score/types/blockchain-job.type"
import { cfg } from "@src/utils/constants/cfg.constant"

@Processor(cfg.queues.creditScore)
export class CreditScoreProcessor {
  private readonly logger = new Logger(CreditScoreProcessor.name)

  public constructor(
    @InjectQueue(cfg.queues.creditScore) private queue: Queue,
    private readonly blockchainProtocolRepository: BlockchainProtocolRepository,
    private readonly blockchainService: BlockchainService,
    private readonly contractRepository: ContractRepository,
    private readonly eventRepository: EventRepository,
    private readonly scanRepository: ScanRepository,
  ) {}

  // Processors

  @Process(cfg.jobs.start)
  public async start(job: Job<StartJobType>) {
    const data = job.data

    const blockchainProtocols = await this.blockchainProtocolRepository.findManyByBlockchainId(data.blockchain.id)
    const blockchainProtocolIds = blockchainProtocols.map((b) => b.id)
    const contracts = await this.contractRepository.findManyByBlockchainProtocolIds(blockchainProtocolIds)
    const contractIds = contracts.map((c) => c.id)
    const events = await this.eventRepository.findManyByContractIds(contractIds)

    this.queue.add(cfg.jobs.eventWallet, {
      events: events,
      wallets: data.wallets,
    })
  }

  @Process(cfg.jobs.eventWallet)
  public async eventWallet(job: Job<EventWalletJobType>) {
    const data = job.data

    await this.blockchainService.processEventsByWallets(data)
  }

  @Process(cfg.jobs.eventLog)
  public async eventLog(job: Job<EventLogJobType>) {
    const data = job.data

    await this.scanRepository.create({
      data: {
        transactionHash: data.eventLog.transactionHash,
        blockHash: data.eventLog.blockHash,
        data: data.eventLog.data,
        event: { connect: { id: data.event.id } },
        wallet: { connect: { id: data.wallet.id } },
      },
    })
  }

  // Listeners

  @OnQueueEvent(cfg.listeners.completed)
  onCompleted({ id, returnvalue }: { id: string; returnvalue: any }) {
    this.logger.log(`Job ${id} completed with result: ${JSON.stringify(returnvalue)}`)
  }

  @OnQueueEvent(cfg.listeners.failed)
  onFailed({ id, failedReason }: { id: string; failedReason: string }) {
    this.logger.error(`Job ${id} failed with reason: ${failedReason}`)
  }

  @OnQueueEvent(cfg.listeners.progress)
  onProgress({ id, data }: { id: string; data: any }) {
    this.logger.log(`Job ${id} in progress with data ${JSON.stringify(data)}`)
  }
}
