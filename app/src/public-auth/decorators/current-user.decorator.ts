import { ExecutionContext, createParamDecorator } from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"
import { User } from "@prisma/client"

export const UserCurrent = createParamDecorator((data: unknown, context: ExecutionContext): User => {
  const gql = GqlExecutionContext.create(context).getContext().req
  const rest = context.switchToHttp().getRequest()
  const request = gql || rest
  return request.user as User
})
