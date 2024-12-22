import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class ScoreModel {
  @Field()
  public slug!: string

  @Field()
  public value!: string

  @Field()
  public isActive!: boolean

  @Field()
  public createdAt!: Date

  @Field()
  public updatedAt!: Date
}
