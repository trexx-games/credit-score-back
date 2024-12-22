import { AuthenticateInput } from "@src/public-auth/inputs/authenticate.input"

export class AuthenticateByInputCommand {
  public constructor(public readonly input: AuthenticateInput) {}
}
