import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Logger } from '../../../shared/logger/logger.service';
import { ConfigService } from '../../../shared/config/config.service';
import { jwtValidation } from '../shared/jwtValidation';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly configService: ConfigService) {}

  //TODO need to be adapted
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    try {
      jwtValidation({
        secret: this.configService.get('JWT_SECRET_KEY'),
        token: request.headers.authorization as string,
      });
    } catch (error) {
      Logger.error(error.message, 'jwtValidation');
      return false;
    }
  }
}