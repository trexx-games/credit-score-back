import { BullModule } from "@nestjs/bull"
import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"

import { BlockchainService } from "@src/blockchain/blockchain.service"
import { DbModule } from "@src/db/db.module"
import { EnvModule } from "@src/env/env.module"
import { cfg } from "@src/utils/constants/cfg.constant"

@Module({
  imports: [CqrsModule, BullModule.registerQueue({ name: cfg.queues.creditScore }), DbModule, EnvModule],
  providers: [BlockchainService],
  exports: [BlockchainService],
})
export class BlockchainModule {}
