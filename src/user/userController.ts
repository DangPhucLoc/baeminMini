import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common'
import { UserService } from './userService'
import { SignupDto } from 'src/dtos/signup.dto'
import { UserDto } from 'src/dtos/user.dto'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags } from '@nestjs/swagger'
import { RolesGuard } from 'src/guards/roleGuard'
import { Roles } from 'src/guards/roleDecorator'


@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    // ! USER MAIN
    @ApiTags('User Main')
    @Post('signup')
    signup(@Body() signupDto: SignupDto) {
        return this.userService.createUser(signupDto);
    }

    @ApiTags('User Main')
    @UseGuards(AuthGuard('jwt-token-strat'))
    @Put('update')
    updateUser(
        @Request() req: { user: { userId: any, email: any, role: any } },
        @Body() userData: UserDto) {
        return this.userService.updateUser(req.user.userId, userData)
    }

    @ApiTags('User Main')
    @UseGuards(AuthGuard('jwt-token-strat'), RolesGuard)
    @Roles(["MANAGER"])
    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @ApiTags('User Main')
    @UseGuards(AuthGuard('jwt-token-strat'), RolesGuard)
    @Roles(["MANAGER"])
    @Get('by-pagination')
    findUsersByPagination(@Query('page') page: string, @Query('limit') limit: string) {
        return this.userService.findByPagination(Number(page), Number(limit));
    }

    @ApiTags('User Main')
    @UseGuards(AuthGuard('jwt-token-strat'))
    @Get('by-id')
    findUserById(@Query('id') id: string) {
        return this.userService.findById(Number(id));
    }

    @ApiTags('User Main')
    @UseGuards(AuthGuard('jwt-token-strat'), RolesGuard)
    @Roles(["USER", "MANAGER"])
    @Delete('delete/:id')
    deleteUser(@Param('id') id: number, @Request() req: { user: { userId: any, email: any, role: any } }) {
        return this.userService.deleteUser(id, req.user.userId, req.user.role)
    }
    //*****************************************************
}
