import { IsEmail, IsString, IsOptional, IsEnum, IsNotEmpty, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class MealDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    price: number

    @ApiProperty()
    @IsString()
    @IsOptional()
    image: string
}