import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { Score } from "@prisma/client"
import { ScoreRepository } from "@src/db/score.repository"
import { ScoreFindByArgsQuery } from "../queries/score-find-by-args-query"

@QueryHandler(ScoreFindByArgsQuery)
export class ScoreFindByArgsHandler implements IQueryHandler<ScoreFindByArgsQuery> {
  public constructor(private readonly scoreRepository: ScoreRepository) {}

  public async execute(query: ScoreFindByArgsQuery): Promise<Score[]> {
    const { slug } = query.args

    const scores = await this.scoreRepository.findAllByUserSlug(slug)

    return scores.reverse()
  }
}
