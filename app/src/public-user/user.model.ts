import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class UserModel {
  @Field()
  public slug!: string

  @Field()
  public name!: string

  @Field()
  public createdAt!: Date

  @Field()
  public updatedAt!: Date
}
