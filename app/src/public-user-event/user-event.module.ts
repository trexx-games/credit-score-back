import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { CryptographyModule } from "@src/cryptography/cryptography.module"
import { DbModule } from "@src/db/db.module"
import { JwtModule } from "@src/jwt/jwt.module"
import { UserEventFindByArgsHandler } from "./handlers/user-event-find-by-args.handler"
import { UserEventResolver } from "./user-event.resolver"

@Module({
  imports: [CqrsModule, DbModule, JwtModule, CryptographyModule],
  providers: [UserEventFindByArgsHandler, UserEventResolver],
})
export class UserEventModule {}
