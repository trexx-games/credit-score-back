import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql"
import { Contact, Score, User, Wallet } from "@prisma/client"
import { ContactLoader } from "@src/db/contact.loader"
import { ScoreLoader } from "@src/db/score.loader"
import { WalletLoader } from "@src/db/wallet.loader"
import { ContactModel } from "@src/public-contact/contact.model"
import { ScoreModel } from "@src/public-score/score.model"
import { UserCreateByInputCommand } from "@src/public-user/commands/user-create-by-input.command"
import { UserCreateInput } from "@src/public-user/inputs/user-create.input"
import { UserFindByArgsQuery } from "@src/public-user/queries/user-find-by-args.query"
import { UserModel } from "@src/public-user/user.model"
import { WalletModel } from "@src/public-wallet/wallet.model"
import { SlugArgs } from "@src/utils/args/slug.args"

@Resolver(() => UserModel)
export class UserResolver {
  public constructor(
    private readonly queryBus: QueryBus,
    private readonly walletLoader: WalletLoader,
    private readonly scoreLoader: ScoreLoader,
    private readonly contactLoader: ContactLoader,
    private readonly commandBus: CommandBus,
  ) {}

  @Query(() => UserModel)
  public async user(@Args() args: SlugArgs): Promise<User> {
    return this.queryBus.execute(new UserFindByArgsQuery(args))
  }

  @Mutation(() => UserModel)
  public async userCreate(@Args("input") input: UserCreateInput): Promise<User> {
    return this.commandBus.execute(new UserCreateByInputCommand(input))
  }

  @ResolveField(() => ContactModel)
  public async email(@Parent() user: User): Promise<Contact> {
    return this.contactLoader.loadActiveEmailByUserId.load(user.id)
  }

  @ResolveField(() => ContactModel, { nullable: true })
  public async phone(@Parent() user: User): Promise<Contact | undefined> {
    return this.contactLoader.loadActivePhoneByUserId.load(user.id)
  }

  @ResolveField(() => [WalletModel])
  public async wallets(@Parent() user: User): Promise<Wallet[]> {
    return this.walletLoader.loadManyByUserId.load(user.id)
  }

  @ResolveField(() => ScoreModel, { nullable: true })
  public async score(@Parent() user: User): Promise<Score | undefined> {
    return this.scoreLoader.loadActiveByUserId.load(user.id)
  }
}
