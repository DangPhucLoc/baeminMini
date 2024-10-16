import { IsEmail, IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    username: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsEmail()
    @IsOptional()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    address?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    firstName?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    lastName?: string;

    @IsEnum(['USER', 'MANAGER', 'ADMIN'])
    @IsOptional()
    @IsNotEmpty()
    role?: string;

    @IsString()
    @IsOptional()
    verification_token?: string

  
}


