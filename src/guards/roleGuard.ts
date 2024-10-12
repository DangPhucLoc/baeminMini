import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Roles } from './roleDecorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.getAllAndOverride<string[]>(Roles, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!roles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException('Authorization header is missing');
        }

        const token = this.extractToken(authHeader);

        try {
            const payload = await this.validateToken(token);

            if (!this.hasRequiredRole(payload.role, roles)) {
                throw new ForbiddenException('User does not have the required roles');
            }

            request.user = payload;
            return true;
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }

    private extractToken(authHeader: string): string {
        const parts = authHeader.split(' ');

        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            throw new UnauthorizedException('Invalid authorization format');
        }

        return parts[1];
    }

    private async validateToken(token: string): Promise<any> {
        try {
            const decoded = await this.jwtService.verifyAsync(token);
            return decoded;
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }

    private hasRequiredRole(userRole: string, requiredRoles: string[]): boolean {
        return requiredRoles.includes(userRole);
    }
}
