import { Module } from "@nestjs/common"

import { DbProviders } from "@src/db/db.provider"
import { PrismaModule } from "@src/prisma/prisma.module"

@Module({
  imports: [PrismaModule],
  providers: DbProviders,
  exports: DbProviders,
})
export class DbModule {}
