import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class EnvService {
  public constructor(private readonly configService: ConfigService) {}

  public get IS_PRODUCTION() {
    return this.configService.get("NODE_ENV") === "production"
  }

  public get IS_TEST() {
    return this.configService.get("NODE_ENV") === "test"
  }

  public get NODE_ENV() {
    return this.configService.get("NODE_ENV") as "local" | "test" | "development" | "production"
  }

  public get PORT() {
    return this.configService.get("PORT") as number
  }

  public get REDIS_HOST() {
    return this.configService.get("REDIS_HOST") as string
  }

  public get REDIS_PORT() {
    return this.configService.get("REDIS_PORT") as number
  }

  public get REDIS_PASSWORD() {
    return this.configService.get("REDIS_PASSWORD") as string
  }

  public get JWT_ACCESS_SECRET() {
    return this.configService.get("JWT_ACCESS_SECRET") as string
  }

  public get TREXX_BLOCKCHAIN_URL() {
    return this.configService.get("TREXX_BLOCKCHAIN_URL") as string
  }

  public get TREXX_WALLET_KEY() {
    return this.configService.get("TREXX_WALLET_KEY") as string
  }

  public get TREXX_CREDIT_SCORE_CONTRACT() {
    return this.configService.get("TREXX_CREDIT_SCORE_CONTRACT") as string
  }
}
