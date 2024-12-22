import { UseGuards } from "@nestjs/common"
import { CommandBus } from "@nestjs/cqrs"
import { Args, Mutation, Parent, ResolveField, Resolver } from "@nestjs/graphql"
import { Scan, User, Wallet } from "@prisma/client"
import { ScanLoader } from "@src/db/scan.loader"
import { UserCurrent } from "@src/public-auth/decorators/current-user.decorator"
import { UserGuard } from "@src/public-auth/guards/user.guard"
import { ScanModel } from "@src/public-scan/scan.model"
import { WalletCreateByInputCommand } from "@src/public-wallet/commands/wallet-create-by-input.command"
import { WalletCreateInput } from "@src/public-wallet/inputs/wallet-create.input"
import { WalletModel } from "@src/public-wallet/wallet.model"

@Resolver(() => WalletModel)
export class WalletResolver {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly scanLoader: ScanLoader,
  ) {}

  @UseGuards(UserGuard)
  @Mutation(() => WalletModel)
  public async walletCreate(@UserCurrent() user: User, @Args("input") input: WalletCreateInput): Promise<Wallet> {
    return this.commandBus.execute(new WalletCreateByInputCommand(input, user))
  }

  @ResolveField(() => [ScanModel])
  public async scans(@Parent() wallet: Wallet): Promise<Scan[]> {
    return this.scanLoader.loadManyByWalletId.load(wallet.id)
  }
}
