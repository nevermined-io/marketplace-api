import { ForbiddenException } from '@nestjs/common';
import { AuthRoles } from '../type';

export const checkOwnership = (userId: string, entityUserId: string, roles: AuthRoles[]) => {
  if (!roles.some((r) => r === AuthRoles.Admin) && userId !== entityUserId) {
    throw new ForbiddenException('This source only can be updated by the owner or admin');
  }
};
