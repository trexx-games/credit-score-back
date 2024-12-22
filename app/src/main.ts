import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common"
import { NestFactory, Reflector } from "@nestjs/core"
import { NestExpressApplication } from "@nestjs/platform-express"
import { WinstonModule, utilities as nestWinstonModuleUtilities } from "nest-winston"
import winston from "winston"

import { AppModule } from "@src/app.module"
import { EnvService } from "@src/env/env.service"

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(),
          ),
        }),
      ],
    }),
  })

  const envService = app.get<EnvService>(EnvService)

  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

  app.enableCors()

  app.enableShutdownHooks()

  await app.listen(envService.PORT)
}

bootstrap()
