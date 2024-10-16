import { Controller, Post, UseGuards, Get, Request } from '@nestjs/common'
import { AuthService } from './authService'
import { AuthGuard } from '@nestjs/passport'
import { User } from '@prisma/client'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import { LoginDto } from 'src/dtos/login.dto'

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(AuthGuard("credentials-strat"))
    @Post('login')
    // ! this Request is not the Request from calling api, it is the request return by credentals.strategy.ts
    @ApiBody({ type: LoginDto })
    login(@Request() req: { user: User }) {
        // console.log(req);
        // ? req.user is from validate() in credentials.strategy.ts
        return this.authService.login(req.user)
    }

    @UseGuards(AuthGuard("jwt-refresh-token-strat"))
    @Post('refresh')
    resetToken(@Request() req: { user: User }) {
        return this.authService.resetToken(req.user)
    }

}