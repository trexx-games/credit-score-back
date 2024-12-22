import { Field, ObjectType, registerEnumType } from "@nestjs/graphql"
import { ContactType } from "@prisma/client"

registerEnumType(ContactType, {
  name: "ContactType",
})

@ObjectType()
export class ContactModel {
  @Field()
  public slug!: string

  @Field(() => ContactType)
  public type!: ContactType

  @Field()
  public value!: string

  @Field()
  public isActive!: boolean

  @Field()
  public createdAt!: Date

  @Field()
  public updatedAt!: Date
}
