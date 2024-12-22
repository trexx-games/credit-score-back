import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class ScanModel {
  @Field()
  public slug!: string

  @Field()
  public transactionHash!: string

  @Field()
  public blockHash!: string

  @Field()
  public data!: string

  @Field()
  public createdAt!: Date

  @Field()
  public updatedAt!: Date
}
