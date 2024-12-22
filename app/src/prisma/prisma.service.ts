import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common"
import { PrismaClient } from "@prisma/client"

import { EnvService } from "@src/env/env.service"

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  public constructor(envService: EnvService) {
    super({
      log:
        envService.IS_PRODUCTION || envService.IS_TEST
          ? undefined
          : [
              { emit: "stdout", level: "query" },
              { emit: "stdout", level: "info" },
              { emit: "stdout", level: "warn" },
              { emit: "stdout", level: "error" },
            ],
    })
  }

  public async onModuleInit(): Promise<void> {
    await this.$connect()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.$on("query", async (e) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      console.log(`${e.params}`)
    })
  }

  public async enableShutdownHooks(app: INestApplication) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.$on("beforeExit", async () => {
      await app.close()
    })
  }
}
