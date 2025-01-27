import { IsEmail, IsString, IsOptional, IsEnum, IsNotEmpty, IsNumber, Matches, IsBoolean } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string
}