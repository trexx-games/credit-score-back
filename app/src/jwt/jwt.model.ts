import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class JwtModel {
  @Field()
  public accessToken!: string

  @Field()
  public refreshToken!: string
}
