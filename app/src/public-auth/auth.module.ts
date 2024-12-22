import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { CryptographyModule } from "@src/cryptography/cryptography.module"

import { DbModule } from "@src/db/db.module"
import { AuthResolver } from "@src/public-auth/auth.resolver"
import { AuthenticateByInputHandler } from "@src/public-auth/handlers/authenticate-by-input.handler"

@Module({
  imports: [CqrsModule, DbModule, CryptographyModule],
  providers: [AuthenticateByInputHandler, AuthResolver],
})
export class AuthModule {}
