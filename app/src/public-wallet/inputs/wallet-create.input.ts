import { Field, InputType } from "@nestjs/graphql"
import { IsWalletAddress } from "@src/utils/decorators/is-wallet-address.decorator"
import { IsString } from "class-validator"

@InputType()
export class WalletCreateInput {
  @Field()
  @IsWalletAddress()
  public address!: string

  @Field()
  @IsString()
  public signature!: string

  @Field()
  @IsString()
  public message!: string
}
