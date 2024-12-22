import { Global, Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"

import { EnvService } from "@src/env/env.service"

@Global()
@Module({
  imports: [ConfigModule.forRoot()],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
