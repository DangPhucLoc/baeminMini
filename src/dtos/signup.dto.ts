import { IsEmail, IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';


export class SignupDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    firstName: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastName: string
  
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string
  
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string
  
    @ApiProperty()
    @IsString()
    @IsOptional()
    address: string
  
    @ApiProperty()
    @IsString()
    @IsOptional()
    phone: string
}