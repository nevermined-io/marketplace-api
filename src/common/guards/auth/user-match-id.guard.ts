import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from '../../helpers/request.interface';
import { AuthRoles } from '../../type';

@Injectable()
export class UserMatchId implements CanActivate {
  static fromParam(param: string, accessRoles?: AuthRoles[]) {
    return new UserMatchId(param, accessRoles);
  }

  private param: string;
  private accessRoles: AuthRoles[];

  constructor(param: string, accessRoles?: AuthRoles[]) {
    this.param = param;
    this.accessRoles = accessRoles || [];
  }

  canActivate(context: ExecutionContext) {
    const { user, body, query, params } = context.switchToHttp().getRequest<Request<{ userId: string }>>();
    const userRoles = user.roles.map((role) => role.toLowerCase());

    return (
      user.userId === body[this.param] ||
      user.userId === query[this.param] ||
      user.userId === params[this.param] ||
      this.accessRoles.some((accessRole) => userRoles.includes(accessRole.toLowerCase()))
    );
  }
}
