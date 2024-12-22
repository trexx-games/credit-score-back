import { UnprocessableEntityException } from "@nestjs/common"
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { ContactType, User } from "@prisma/client"
import { CryptographyService } from "@src/cryptography/cryptography.service"
import { ContactRepository } from "@src/db/contact.repository"
import { UserRepository } from "@src/db/user.repository"
import { UserCreateByInputCommand } from "@src/public-user/commands/user-create-by-input.command"

@CommandHandler(UserCreateByInputCommand)
export class UserCreateByInputHandler implements ICommandHandler<UserCreateByInputCommand> {
  public constructor(
    private readonly contactRepository: ContactRepository,
    private readonly userRepository: UserRepository,
    private readonly cryptographyService: CryptographyService,
  ) {}

  public async execute(command: UserCreateByInputCommand): Promise<User> {
    const { name, email, password } = command.input

    const emailAlreadyTaken = await this.contactRepository.findFirstActiveByValue(email)

    if (emailAlreadyTaken) {
      throw new UnprocessableEntityException("Email already taken.")
    }

    const hashedPassword = await this.cryptographyService.hash(password)

    const user = await this.userRepository.create({
      data: {
        name: name,
        password: hashedPassword,
      },
    })

    await this.contactRepository.create({
      data: {
        type: ContactType.Email,
        value: email,
        user: { connect: { id: user.id } },
      },
    })

    return user
  }
}
