import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { BlockchainModule } from "@src/blockchain/blockchain.module"
import { DbModule } from "@src/db/db.module"
import { WalletCreateByInputHandler } from "@src/public-wallet/handlers/wallet-create-by-input.handler"
import { WalletResolver } from "@src/public-wallet/wallet.resolver"

@Module({
  imports: [CqrsModule, DbModule, BlockchainModule],
  providers: [WalletCreateByInputHandler, WalletResolver],
})
export class WalletModule {}
