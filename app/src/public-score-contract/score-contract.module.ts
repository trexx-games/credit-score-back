import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"

import { DbModule } from "@src/db/db.module"
import { CreditScoreCreateByInputHandler } from "@src/public-credit-score/handlers/credit-score-create-by-input.handler"
import { ScoreContractResolver } from "@src/public-score-contract/score-contract.resolver"

@Module({
  imports: [DbModule, CqrsModule],
  providers: [CreditScoreCreateByInputHandler, ScoreContractResolver],
})
export class ScoreContractModule {}
