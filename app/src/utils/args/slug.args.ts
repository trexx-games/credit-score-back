import { ArgsType, Field, ID } from "@nestjs/graphql"

@ArgsType()
export class SlugArgs {
  @Field(() => ID)
  public slug!: string
}
