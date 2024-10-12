import { IsEmail, IsString, IsOptional, IsEnum, IsNotEmpty, IsNumber, Matches, IsBoolean } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class OrderDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    meal_id: string

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    quantity: number

}

export class UpdateOrderStatusDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    STATUS: string
}