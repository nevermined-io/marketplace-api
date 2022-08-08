import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { ConfigModule } from '../shared/config/config.module';
import { ConfigService } from '../shared/config/config.service';
import { UserProfileModule } from '../user-profiles/user-profile.module';
import { PermissionModule } from '../permissions/permission.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    UserProfileModule,
    PermissionModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get('JWT_SECRET_KEY'),
          signOptions: { expiresIn: config.get('JWT_EXPIRY_KEY') },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, ConfigService],
  controllers: [AuthController],
})
export class AuthModule {}
