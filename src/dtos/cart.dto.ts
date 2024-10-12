import { IsEmail, IsString, IsOptional, IsEnum, IsNotEmpty, IsNumber, Matches, IsBoolean } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class CartDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    meal_id: string

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    quantity: number
}