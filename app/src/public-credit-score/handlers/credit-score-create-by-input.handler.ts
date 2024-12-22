import { InjectQueue } from "@nestjs/bull"
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { Queue } from "bull"

import { BlockchainRepository } from "@src/db/blockchain.repository"
import { ScoreRepository } from "@src/db/score.repository"
import { WalletRepository } from "@src/db/wallet.repository"
import { CreditScoreCreateByInputCommand } from "@src/public-credit-score/commands/credit-score-create-by-input.command"
import { cfg } from "@src/utils/constants/cfg.constant"

@CommandHandler(CreditScoreCreateByInputCommand)
export class CreditScoreCreateByInputHandler implements ICommandHandler<CreditScoreCreateByInputCommand> {
  public constructor(
    @InjectQueue(cfg.queues.creditScore) private readonly queue: Queue,
    private readonly blockchainRepository: BlockchainRepository,
    private readonly scoreRepository: ScoreRepository,
    private readonly walletRepository: WalletRepository,
  ) {}

  public async execute(command: CreditScoreCreateByInputCommand): Promise<boolean> {
    const { user } = command

    const score = await this.scoreRepository.findLastActiveByUserId(user.id)

    await this.scoreRepository.create({
      data: {
        value: score ? score.value : 0,
        user: { connect: { id: user.id } },
      },
    })

    const wallets = await this.walletRepository.findManyActiveByUserIdOrThrow(user.id)
    const blockchains = await this.blockchainRepository.findManyActive()

    for (const blockchain of blockchains) {
      this.queue.add(cfg.jobs.start, {
        blockchain: blockchain,
        wallets: wallets,
      })
    }

    return true
  }
}
