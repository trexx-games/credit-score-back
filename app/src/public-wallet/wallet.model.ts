import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class WalletModel {
  @Field()
  public slug!: string

  @Field()
  public address!: string

  @Field()
  public isActive!: boolean

  @Field()
  public createdAt!: Date

  @Field()
  public updatedAt!: Date
}
