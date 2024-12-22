import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { UserEvent } from "@prisma/client"
import { UserEventFindByArgsQuery } from "../queries/user-event-find-by-args-query"
import { UserEventRepository } from "@src/db/user-event.repository"

@QueryHandler(UserEventFindByArgsQuery)
export class UserEventFindByArgsHandler implements IQueryHandler<UserEventFindByArgsQuery> {
  public constructor(private readonly userEventRepository: UserEventRepository) {}

  public async execute(query: UserEventFindByArgsQuery): Promise<UserEvent | null> {
    const { slug } = query.args

    const event = await this.userEventRepository.findByUserSlug(slug)

    return event
  }
}
