import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo"
import { BullModule } from "@nestjs/bull"
import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { GraphQLModule } from "@nestjs/graphql"
import { ScheduleModule } from "@nestjs/schedule"
import { Request } from "express"
import { join } from "path"

import { ComplexityPlugin } from "@src/complexity.plugin"
import { EnvModule } from "@src/env/env.module"
import { EnvService } from "@src/env/env.service"
import { JwtModule } from "@src/jwt/jwt.module"
import { ProcessorModule } from "@src/processor/processor.module"
import { AuthModule } from "@src/public-auth/auth.module"
import { CreditScoreModule } from "@src/public-credit-score/credit-score.module"
import { UserModule } from "@src/public-user/user.module"
import { WalletModule } from "@src/public-wallet/wallet.module"
import { ScoreModule } from "./public-score/score.module"
import { UserEventModule } from "./public-user-event/user-event.module"

@Module({
  imports: [
    // Global
    JwtModule,
    EnvModule,

    ScheduleModule.forRoot(),

    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [EnvService],
      useFactory: async (envService: EnvService) => ({
        context: ({ req }: { req: Request }) => ({ req }),
        autoSchemaFile: join(process.cwd(), "src", "app.gql"),
        debug: !envService.IS_PRODUCTION,
        playground: !envService.IS_PRODUCTION,
      }),
    }),

    BullModule.forRootAsync({
      inject: [EnvService],
      useFactory: async (envService: EnvService) => ({
        redis: {
          host: envService.REDIS_HOST,
          port: envService.REDIS_PORT,
          password: envService.REDIS_PASSWORD,
        },
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
        },
        limiter: {
          max: 1,
          duration: 1000,
        },
      }),
    }),

    // Providers
    CqrsModule,

    // Modules
    AuthModule,
    CreditScoreModule,
    ProcessorModule,
    UserModule,
    WalletModule,
    ScoreModule,
    UserEventModule,
  ],
  providers: [ComplexityPlugin],
})
export class AppModule {}
