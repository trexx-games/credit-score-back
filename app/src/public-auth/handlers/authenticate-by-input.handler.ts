import { UnauthorizedException } from "@nestjs/common"
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { JwtService } from "@nestjs/jwt"
import { CryptographyService } from "@src/cryptography/cryptography.service"

import { ContactRepository } from "@src/db/contact.repository"
import { UserRepository } from "@src/db/user.repository"
import { JwtModel } from "@src/jwt/jwt.model"
import { AuthenticateByInputCommand } from "@src/public-auth/commands/authenticate-by-input.command"

@CommandHandler(AuthenticateByInputCommand)
export class AuthenticateByInputHandler implements ICommandHandler<AuthenticateByInputCommand> {
  public constructor(
    private readonly contactRepository: ContactRepository,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly cryptographyService: CryptographyService,
  ) {}

  public async execute(command: AuthenticateByInputCommand): Promise<JwtModel> {
    const { email, password } = command.input

    const contact = await this.contactRepository.findFirstActiveByValueOrThrow(email)
    const user = await this.userRepository.findByIdOrThrow(contact.userId)
    const match = await this.cryptographyService.compare(password, user.password)

    if (!match) {
      throw new UnauthorizedException("Incorrect email or password")
    }

    const payload = { sub: user.slug }

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: "7d" }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: "21d" }),
    }
  }
}
