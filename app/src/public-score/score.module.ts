import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { CryptographyModule } from "@src/cryptography/cryptography.module"
import { DbModule } from "@src/db/db.module"
import { JwtModule } from "@src/jwt/jwt.module"
import { ScoreFindByArgsHandler } from "./handlers/score-find-by-args.handler"
import { ScoreResolver } from "./score.resolver"

@Module({
  imports: [CqrsModule, DbModule, JwtModule, CryptographyModule],
  providers: [ScoreFindByArgsHandler, ScoreResolver],
})
export class ScoreModule {}
