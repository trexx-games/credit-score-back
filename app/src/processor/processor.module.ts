import { BullModule } from "@nestjs/bull"
import { Module } from "@nestjs/common"

import { BlockchainModule } from "@src/blockchain/blockchain.module"
import { DbModule } from "@src/db/db.module"
import { CreditScoreProcessor } from "@src/processor/credit-score.processor"
import { cfg } from "@src/utils/constants/cfg.constant"

@Module({
  imports: [BullModule.registerQueue({ name: cfg.queues.creditScore }), DbModule, BlockchainModule],
  providers: [CreditScoreProcessor],
})
export class ProcessorModule {}
