import { IsEmail, IsString, IsOptional, IsEnum, IsNotEmpty, IsNumber, Matches, IsBoolean } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class ShopDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    address: string

    @ApiProperty({ type: String, format: 'time', example: '09:00' })
    @IsString()
    @IsNotEmpty()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: 'OPEN_TIME must be in the format HH:MM (24-hour)',
    })
    open_time: string

    @ApiProperty({ type: String, format: 'time', example: '09:00' })
    @IsString()
    @IsNotEmpty()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: 'CLOSE_TIME must be in the format HH:MM (24-hour)',
    })
    close_time: string

    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    is_available: boolean


}