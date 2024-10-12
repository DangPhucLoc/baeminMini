import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsInt } from 'class-validator'

export class BookingShippDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    driver_name: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    customer_name: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phone: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    address: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    status: string

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    order_id: number
}

export class UpdateShipStatusDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    status: string
}
