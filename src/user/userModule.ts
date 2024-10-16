import { Module } from '@nestjs/common';
import { UserController } from './userController';
import { UserService } from './userService';
import { PrismaService } from 'src/prisma/prismaService';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtTokenStrategy } from 'src/strategies/jwtAccessTokenStrategy';
import { jwtConstants } from 'src/constants/jwtconstants';

@Module({
  imports: [
    PassportModule,
    // must include {secret:} here, cannot left empty like in auth.module.ts because the controller must have the secret for the AuthGuard
    JwtModule.register({secret: jwtConstants.access_token_secret}),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.MAILER_HOST,
          port: parseInt(process.env.MAILER_PORT, 10),
          secure: true,
          auth: {
            user: process.env.MAILER_EMAIL,
            pass: process.env.MAILER_APP_PASSWORD,
          },
        },
        defaults: {
          from: `"NODE43 Support" <${process.env.MAILER_EMAIL}>`,
        },
        template: {
          dir: process.cwd() + '/src/_templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtTokenStrategy, PrismaService]
})
export class UserModule { }