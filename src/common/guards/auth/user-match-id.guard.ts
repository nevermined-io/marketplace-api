import { CanActivate, ExecutionContext, Injectable, BadRequestException } from '@nestjs/common';
import { Request } from '../../helpers/request.interface';
import { AuthRoles } from '../../type';

@Injectable()
export class UserMatchId implements CanActivate {
  static fromParam(param: string, accessRoles?: AuthRoles[], checkParam?: boolean) {
    return new UserMatchId(param, accessRoles, checkParam);
  }

  private param: string;
  private accessRoles: AuthRoles[];
  private checkParam = false;

  constructor(param: string, accessRoles?: AuthRoles[], checkParam?: boolean) {
    this.param = param;
    this.accessRoles = accessRoles || [];
    this.checkParam = checkParam;
  }

  canActivate(context: ExecutionContext) {
    const { user, body, query, params } = context.switchToHttp().getRequest<Request<{ userId: string }>>();
    const userRoles = user.roles.map((role) => role.toLowerCase());

    if (!body[this.param] && this.checkParam) {
      throw new BadRequestException(`${this.param} is missing in the payload`);
    }

    return (
      user.userId === body[this.param] ||
      user.userId === query[this.param] ||
      user.userId === params[this.param] ||
      this.accessRoles.some((accessRole) => userRoles.includes(accessRole.toLowerCase()))
    );
  }
}
