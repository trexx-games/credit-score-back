import { BullModule } from "@nestjs/bull"
import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"

import { BlockchainModule } from "@src/blockchain/blockchain.module"
import { DbModule } from "@src/db/db.module"
import { CreditScoreResolver } from "@src/public-credit-score/credit-score.resolver"
import { CreditScoreSaga } from "@src/public-credit-score/credit-score.saga"
import { CreditScoreCreateByInputHandler } from "@src/public-credit-score/handlers/credit-score-create-by-input.handler"
import { CreditScoreSaveOnBlockchainByProcessEventsFinishHandler } from "@src/public-credit-score/handlers/credit-score-save-on-blockchain-by-process-events-finished.handler"
import { cfg } from "@src/utils/constants/cfg.constant"

@Module({
  imports: [BullModule.registerQueue({ name: cfg.queues.creditScore }), DbModule, CqrsModule, BlockchainModule],
  providers: [
    CreditScoreCreateByInputHandler,
    CreditScoreSaveOnBlockchainByProcessEventsFinishHandler,
    CreditScoreResolver,
    CreditScoreSaga,
  ],
})
export class CreditScoreModule {}
