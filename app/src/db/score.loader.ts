import { Injectable, Scope } from "@nestjs/common"
import { Score } from "@prisma/client"
import { ScoreRepository } from "@src/db/score.repository"
import DataLoader from "dataloader"

@Injectable({ scope: Scope.REQUEST })
export class ScoreLoader {
  public constructor(private readonly scoreRepository: ScoreRepository) {}

  public loadActiveByUserId = new DataLoader<number, Score | undefined>(async (ids) => {
    const nodes = await this.scoreRepository.findManyByUserIds(ids.concat())
    return ids.map((id) => nodes.find((node) => node.userId === id))
  })
}
