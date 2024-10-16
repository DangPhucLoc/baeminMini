import { MailerService } from '@nestjs-modules/mailer'
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { SignupDto } from 'src/dtos/signup.dto'
import { UserDto } from 'src/dtos/user.dto'
import { PrismaService } from 'src/prisma/prismaService'

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private mailerService: MailerService,
        private jwtService: JwtService
    ) { }

    async createManagerIfNotExists() {
        const managerEmail = 'manager@example.com';
        const existingManager = await this.prisma.user.findFirst({
            where: { email: managerEmail, role: 'MANAGER' },
        })

        if (!existingManager) {
            const hashedPassword = await bcrypt.hash('manager', 10)
            await this.prisma.user.create({
                data: {
                    email: managerEmail,
                    password: hashedPassword,
                    first_name: 'Manager',
                    last_name: 'Example',
                    username: 'manager', // Add username
                    phone: '', // Add phone
                    address: '', // Add address
                    role: 'MANAGER',
                    refresh_token: '',
                    verification_token: '',
                },
            })
        }
    }

    // ! USER
    async createUser(signupData: SignupDto) {
        const {firstName, lastName, email, password: signupPassword, phone, address } = signupData;

        // Check if email is in use
        const emailInUse = await this.prisma.user.findFirst({
            where: { email: email },
        })

        if (emailInUse) {
            throw new BadRequestException('Email already in use')
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(signupPassword, 10)

        // Create user document and save in PostgreSQL using Prisma
        const newUser = await this.prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                first_name: firstName,
                last_name: lastName,
                username: email.split('@')[0], // Add username
                phone: phone,
                address: address,
                role: 'USER',
                refresh_token: '',
                verification_token: '',
                Cart: {
                    create: {
                        quality: 1, // Default quality value
                        price: 0, // Default price value
                    } // This creates a new cart for the user
                }
            },
            include: {
                Cart: true // This includes the created cart in the return value
            }
        })

        const { password, refresh_token, verification_token, ...result } = newUser
        return result
    }

    async createManager(userDto: UserDto) {
        const { email, password, lastName, firstName, phone, address } = userDto

        // Check if email is in use
        const emailInUse = await this.prisma.user.findFirst({
            where: { email: email },
        })

        if (emailInUse) {
            throw new BadRequestException('Email already in use')
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user document and save in PostgreSQL using Prisma
        const newManager = await this.prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                last_name: lastName,
                first_name: firstName,
                username: email.split('@')[0], // Add username
                phone: password,
                address: address,
                role: 'MANAGER',
                refresh_token: '',
                verification_token: '',
            },
        })

        const { password: _, verification_token, refresh_token, ...result } = newManager
        return result
    }

    async updateUser(id: number, userData: UserDto) {
        const user = await this.prisma.user.findUnique({ where: { user_id: id } })

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (userData.password) {
            const hashedPassword = await bcrypt.hash(userData.password, 10)
            userData.password = hashedPassword
        }

        const updatedUser = await this.prisma.user.update({
            where: { user_id: id },
            data: userData,
            select: {
                user_id: true,
                email: true,
                first_name: true,
                last_name: true,
                phone: true,
                address: true,
                role: true
            }
        })

        return updatedUser
    }


    async validateVerificationToken(email: string, verification_code: string) {
        const user = await this.prisma.user.findFirst({ where: { email: email } })
        if (!user || !user.verification_token) {
            throw new UnauthorizedException('User not found or no reset requested')
        }

        try {
            const decodedToken = this.jwtService.verify(user.verification_token)
            if (decodedToken.code !== verification_code) {
                throw new UnauthorizedException('Invalid verification code')
            }

            return { userId: user.user_id, email: user.email }
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired verification token')
        }
    }

    async resetPassword(userId: number, newPassword: string) {
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await this.prisma.user.update({
            where: { user_id: userId },
            data: {
                password: hashedPassword,
                verification_token: "",
            },
            select: {
                user_id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                address: true,
                role: true,
            }
        })

        return { message: 'Password reset successfully' }
    }

    async findAll() {
        return this.prisma.user.findMany({
            orderBy: {
                user_id: 'asc',
            },
            select: {
                user_id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                address: true,
                role: true,
                // Exclude sensitive fields like PASSWORD, REFRESH_TOKEN, and VERIFICATION_TOKEN
            },
        })
    }

    async findByPagination(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                skip,
                take: limit,
                orderBy: {
                    user_id: 'asc',
                },
                select: {
                    user_id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    phone: true,
                    address: true,
                    role: true,
                },
            }),
            this.prisma.user.count(),
        ])

        return {
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
            users
        }
    }

    async findById(id: number) {
        return await this.prisma.user.findUnique({
            where: {
                user_id: id,
            },
            select: {
                user_id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                address: true,
                role: true,
            }
        })
    }

    async deleteUser(id: number, currentUserId: number, currentUserRole: string) {
        const userToDelete = await this.prisma.user.findUnique({ where: { user_id: id } })
        if (!userToDelete) {
            throw new NotFoundException('User not found')
        }

        if (currentUserRole === 'USER' && currentUserId !== id) {
            throw new UnauthorizedException('Users can only delete their own account')
        }

        if (currentUserRole === 'MANAGER') {
            if (userToDelete.role === 'ADMIN' || userToDelete.role === 'MANAGER') {
                throw new UnauthorizedException('Managers can only delete user accounts')
            }
        }

        if (currentUserRole === 'ADMIN' && userToDelete.role === 'ADMIN' && currentUserId !== id) {
            throw new UnauthorizedException('Admins can only delete their own admin account')
        }

        return await this.prisma.user.delete({
            where: { user_id: id },
            select: {
                user_id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                address: true,
                role: true,
            }
        })
    }

}
