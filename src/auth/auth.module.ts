import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { ConfigModule } from '../shared/config/config.module';
import { ConfigService } from '../shared/config/config.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get('JWT_SECRET_KEY'),
          signOptions: { expiresIn: '60m' }
        };
      }
    })
  ],
  providers: [AuthService, JwtStrategy, ConfigService],
  controllers: [AuthController]
})
export class AuthModule { }
