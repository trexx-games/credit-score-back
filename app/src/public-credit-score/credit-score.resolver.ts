import { UseGuards } from "@nestjs/common"
import { CommandBus } from "@nestjs/cqrs"
import { Mutation, Resolver } from "@nestjs/graphql"
import { User } from "@prisma/client"
import { UserCurrent } from "@src/public-auth/decorators/current-user.decorator"
import { UserGuard } from "@src/public-auth/guards/user.guard"

import { CreditScoreCreateByInputCommand } from "@src/public-credit-score/commands/credit-score-create-by-input.command"

@Resolver(() => Boolean)
export class CreditScoreResolver {
  public constructor(private readonly commandBus: CommandBus) {}

  @UseGuards(UserGuard)
  @Mutation(() => Boolean)
  public async creditScoreCreate(@UserCurrent() user: User): Promise<boolean> {
    return this.commandBus.execute(new CreditScoreCreateByInputCommand(user))
  }
}
