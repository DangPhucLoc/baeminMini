import { IsEmail, IsString, IsOptional, IsEnum, IsNotEmpty, IsNumber, Matches, IsBoolean } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class ReviewDto {
    @ApiProperty()
    @IsString()
    comment?: string

    @ApiProperty()
    @IsNumber()
    star?: number
}