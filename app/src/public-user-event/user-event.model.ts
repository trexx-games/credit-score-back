import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class UserEventModel {
  @Field()
  public value!: string

  @Field()
  public blockchain!: string

  @Field()
  public createdAt!: Date

  @Field()
  public updatedAt!: Date
}
