import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { BlockchainService } from "@src/blockchain/blockchain.service"
import { ScoreRepository } from "@src/db/score.repository"
import { UserRepository } from "@src/db/user.repository"

import { CreditScoreSaveOnBlockchainByProcessEventsFinishCommand } from "@src/public-credit-score/commands/credit-score-save-on-blockchain-by-process-events-finished.command"

@CommandHandler(CreditScoreSaveOnBlockchainByProcessEventsFinishCommand)
export class CreditScoreSaveOnBlockchainByProcessEventsFinishHandler
  implements ICommandHandler<CreditScoreSaveOnBlockchainByProcessEventsFinishCommand>
{
  public constructor(
    private readonly scoreRepository: ScoreRepository,
    private readonly userRepository: UserRepository,
    private readonly blockchainService: BlockchainService,
  ) {}

  public async execute(command: CreditScoreSaveOnBlockchainByProcessEventsFinishCommand): Promise<void> {
    const { wallets } = command
    const walletAddresses = wallets.map((wallet) => wallet.address)

    const score = await this.scoreRepository.findActiveByUserIdOrThrow(wallets[0].userId)
    const user = await this.userRepository.findByIdOrThrow(score.userId)

    await this.blockchainService.saveScoreOnBlockchain(user.slug, walletAddresses, score.value)
  }
}
