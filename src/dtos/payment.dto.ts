import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsInt, IsString, IsNumber } from 'class-validator'

export class CreatePaymentDto {
    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    ORDER_ID: number

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    METHOD: string

    @ApiProperty()
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsNotEmpty()
    AMOUNT: number
}
