import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { UserRepository } from "@src/db/user.repository"

import { EnvService } from "@src/env/env.service"
import { BaseGuard } from "@src/public-auth/guards/base.guard"

@Injectable()
export class UserGuard extends BaseGuard {
  public constructor(
    protected readonly jwtService: JwtService,
    protected readonly envService: EnvService,
    protected readonly userRepository: UserRepository,
  ) {
    super(jwtService, envService)
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = super.getRequest(context)
    const accessToken = super.getAccessToken(request)

    if (!accessToken) {
      throw new UnauthorizedException("Authorization not found")
    }

    const slug = super.getSlug(accessToken)

    if (!slug) {
      throw new UnauthorizedException("Invalid token")
    }

    const user = await this.userRepository.findBySlugOrThrow(slug)

    request.user = user

    return true
  }
}
