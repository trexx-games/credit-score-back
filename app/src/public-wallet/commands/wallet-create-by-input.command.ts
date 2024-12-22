import { User } from "@prisma/client"
import { WalletCreateInput } from "@src/public-wallet/inputs/wallet-create.input"

export class WalletCreateByInputCommand {
  public constructor(
    public readonly input: WalletCreateInput,
    public readonly user: User,
  ) {}
}
