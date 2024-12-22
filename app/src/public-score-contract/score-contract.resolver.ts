import { CommandBus } from "@nestjs/cqrs"
import { Query, Resolver } from "@nestjs/graphql"

@Resolver(() => Boolean)
export class ScoreContractResolver {
  public constructor(private readonly commandBus: CommandBus) {}

  @Query(() => Boolean)
  public async test(): Promise<boolean> {
    return true
  }
}
