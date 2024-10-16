import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { PrismaService } from 'src/prisma/prismaService'
import { AuthController } from './authController'
import { AuthService } from './authService'
import { CredentialsStrategy } from 'src/strategies/credentialStrategies'
import { JwtTokenStrategy } from 'src/strategies/jwtAccessTokenStrategy'
import { JwtRefreshTokenStrategy } from 'src/strategies/jwtRefreshTokenStrategy'


@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
  ],
  providers: [AuthService, CredentialsStrategy, JwtTokenStrategy, JwtRefreshTokenStrategy, PrismaService],
  controllers: [AuthController]
})
export class AuthModule { }

