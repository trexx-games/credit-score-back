import { User } from "@prisma/client"

export class CreditScoreCreateByInputCommand {
  public constructor(public readonly user: User) {}
}
