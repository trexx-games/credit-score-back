import { QueryBus } from "@nestjs/cqrs"
import { Args, Query, Resolver } from "@nestjs/graphql"
import { Score } from "@prisma/client"
import { ScoreFindByArgsQuery } from "@src/public-score/queries/score-find-by-args-query"
import { ScoreModel } from "@src/public-score/score.model"
import { SlugArgs } from "@src/utils/args/slug.args"

@Resolver(() => ScoreModel)
export class ScoreResolver {
  public constructor(private readonly queryBus: QueryBus) {}

  @Query(() => [ScoreModel])
  public async scores(@Args() args: SlugArgs): Promise<Score[]> {
    return this.queryBus.execute(new ScoreFindByArgsQuery(args))
  }
}
