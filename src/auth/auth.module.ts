import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { PrismaConfigModule } from 'src/prisma-config/prisma-config.module';
@Module({
  imports: [
    PrismaConfigModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET_JWT
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy
  ],
})
export class AuthModule { }
