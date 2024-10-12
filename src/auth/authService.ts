import { Injectable, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../prisma/prismaService'
import { LoginDto } from '../dtos/login.dto'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { jwtConstants } from '../constants/jwtconstants'

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) { }

    async validateUser(loginData: LoginDto) {
        const { email, password } = loginData
        const user = await this.prisma.user.findFirst({
            where: { EMAIL: email },
        })
        if (!user) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const isPasswordMatch = await bcrypt.compare(password, user.PASSWORD)
        if (isPasswordMatch) {
            // ? collect all properties of user except password to new [result] variable
            const { PASSWORD, ...result } = user
            return result
        }
        return null
    }

    async validateRefreshToken(input_refresh_token: string) {
        const token = input_refresh_token.split(' ')[1]
        const user = await this.prisma.user.findFirst({
            where: { REFRESH_TOKEN: token },
        })

        if (user) {
            const { PASSWORD, ...result } = user
            return result
        }
        return null
    }

    async login(user: User) {
        const payload = { email: user.EMAIL, sub: user.ID, role: user.ROLE }
        const access_token = this.jwtService.sign(payload, { expiresIn: '5m', secret: jwtConstants.access_token_secret })
        const refresh_token = this.jwtService.sign(payload, { expiresIn: '1w', secret: jwtConstants.refresh_token_secret })

        await this.prisma.user.update({
            where: { ID: user.ID },
            data: { REFRESH_TOKEN: refresh_token },
        })

        return {
            access_token,
            refresh_token,
        }
    }

    async resetToken(user: User) {
        const payload = { sub: user.ID, email: user.EMAIL, role: user.ROLE }
        const access_token = this.jwtService.sign(payload, { expiresIn: '5m', secret: jwtConstants.access_token_secret })
        return {
            access_token
        }
    }

}
