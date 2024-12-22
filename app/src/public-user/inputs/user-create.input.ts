import { Field, InputType } from "@nestjs/graphql"
import { Transform } from "class-transformer"
import { IsEmail, MinLength } from "class-validator"

@InputType()
export class UserCreateInput {
  @Field()
  @MinLength(3)
  @Transform((value) => (value.value as string).trim())
  public name!: string

  @Field()
  @IsEmail()
  @Transform((value) => (value.value as string).toLowerCase().trim())
  public email!: string

  @Field()
  @MinLength(8)
  public password!: string
}
