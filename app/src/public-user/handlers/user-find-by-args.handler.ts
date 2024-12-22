import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { User } from "@prisma/client"
import { UserRepository } from "@src/db/user.repository"
import { UserFindByArgsQuery } from "@src/public-user/queries/user-find-by-args.query"

@QueryHandler(UserFindByArgsQuery)
export class UserFindByArgsHandler implements IQueryHandler<UserFindByArgsQuery> {
  public constructor(private readonly userRepository: UserRepository) {}

  public async execute(query: UserFindByArgsQuery): Promise<User> {
    const { slug } = query.args

    return this.userRepository.findBySlugOrThrow(slug)
  }
}
