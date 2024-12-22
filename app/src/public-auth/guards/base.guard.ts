import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"
import { JwtService } from "@nestjs/jwt"

import { EnvService } from "@src/env/env.service"

@Injectable()
export class BaseGuard implements CanActivate {
  public constructor(
    protected readonly jwtService: JwtService,
    protected readonly envService: EnvService,
  ) {}

  protected getRequest(context: ExecutionContext): any {
    const graphqlRequest = GqlExecutionContext.create(context).getContext().req
    const restRequest = context.switchToHttp().getRequest()
    const request = graphqlRequest || restRequest
    return request
  }

  private parseAccessTokenFromHeader(request: any): string | undefined {
    try {
      const header = request.headers.authorization as string | undefined
      if (header) {
        const accessToken = header.split(" ")[1]
        return accessToken
      }
      return undefined
    } catch (e) {
      return undefined
    }
  }

  protected getAccessToken(request: any): string | undefined {
    const accessToken = this.parseAccessTokenFromHeader(request)
    return accessToken
  }

  private parseSlug(accessToken: string): string | undefined {
    try {
      this.jwtService.verify(accessToken)
      const payload = this.jwtService.decode(accessToken) as { sub: string }
      const slug = payload.sub
      return slug
    } catch (e) {
      return undefined
    }
  }

  protected getSlug(accessToken: string): string | undefined {
    const slug = this.parseSlug(accessToken)
    return slug
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    return !!context
  }
}
