import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { CryptographyModule } from "@src/cryptography/cryptography.module"
import { DbModule } from "@src/db/db.module"
import { JwtModule } from "@src/jwt/jwt.module"
import { UserCreateByInputHandler } from "@src/public-user/handlers/user-create-by-input.handler"
import { UserFindByArgsHandler } from "@src/public-user/handlers/user-find-by-args.handler"
import { UserResolver } from "@src/public-user/user.resolver"

@Module({
  imports: [CqrsModule, DbModule, JwtModule, CryptographyModule],
  providers: [UserFindByArgsHandler, UserCreateByInputHandler, UserResolver],
})
export class UserModule {}
