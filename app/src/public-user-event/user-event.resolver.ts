import { QueryBus } from "@nestjs/cqrs"
import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql"
import { User, UserEvent } from "@prisma/client"
import { SlugArgs } from "@src/utils/args/slug.args"
import { UserEventFindByArgsQuery } from "./queries/user-event-find-by-args-query"
import { UserEventModel } from "./user-event.model"

@Resolver(() => UserEventModel)
export class UserEventResolver {
  public constructor(private readonly queryBus: QueryBus) {}

  @Query(() => UserEventModel)
  public async event(@Args() args: SlugArgs): Promise<UserEvent> {
    return this.queryBus.execute(new UserEventFindByArgsQuery(args))
  }
}
