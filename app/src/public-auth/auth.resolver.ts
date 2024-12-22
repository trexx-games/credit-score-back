import { CommandBus } from "@nestjs/cqrs"
import { Args, Mutation, Resolver } from "@nestjs/graphql"

import { JwtModel } from "@src/jwt/jwt.model"
import { AuthenticateByInputCommand } from "@src/public-auth/commands/authenticate-by-input.command"
import { AuthenticateInput } from "@src/public-auth/inputs/authenticate.input"

@Resolver()
export class AuthResolver {
  public constructor(private readonly commandBus: CommandBus) {}

  @Mutation(() => JwtModel)
  public async authenticate(@Args("input") input: AuthenticateInput): Promise<JwtModel> {
    return this.commandBus.execute(new AuthenticateByInputCommand(input))
  }
}
