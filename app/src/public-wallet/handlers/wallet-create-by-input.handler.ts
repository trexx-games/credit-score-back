import { UnprocessableEntityException } from "@nestjs/common"
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { Wallet } from "@prisma/client"
import { BlockchainService } from "@src/blockchain/blockchain.service"
import { WalletRepository } from "@src/db/wallet.repository"
import { WalletCreateByInputCommand } from "@src/public-wallet/commands/wallet-create-by-input.command"

@CommandHandler(WalletCreateByInputCommand)
export class WalletCreateByInputHandler implements ICommandHandler<WalletCreateByInputCommand> {
  public constructor(
    private readonly blockchainService: BlockchainService,
    private readonly walletRepository: WalletRepository,
  ) {}

  public async execute(command: WalletCreateByInputCommand): Promise<Wallet> {
    const { user } = command
    const { address, message, signature } = command.input

    const walletAlreadyTaken = await this.walletRepository.findFirstByAddress(address)

    if (walletAlreadyTaken) {
      throw new UnprocessableEntityException("Wallet already taken.")
    }

    // const verifySignedMessageResult = this.blockchainService.verifySignedMessage({
    //   message: message,
    //   signature: signature,
    //   walletAddress: address,
    // })

    // if (!verifySignedMessageResult) {
    //   throw new BadRequestException("The signed message does not match the provided wallet address.")
    // }

    const wallet = await this.walletRepository.create({
      data: {
        address: address,
        user: { connect: { id: user.id } },
      },
    })

    return wallet
  }
}
