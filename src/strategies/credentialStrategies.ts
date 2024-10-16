import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from '../auth/authService'
import { LoginDto } from '../dtos/login.dto'


@Injectable()
export class CredentialsStrategy extends PassportStrategy(Strategy, "credentials-strat") {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'email',
            passwordField: 'password',
        });
    }

    async validate(email: string, password: string): Promise<any> {
        const loginData: LoginDto = { email, password }
        const user = await this.authService.validateUser(loginData)
        if (!user) {
            throw new UnauthorizedException('Invalid credentials')
        }
        return user
    }
}