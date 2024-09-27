import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class SeeNotificationsDto {
  @ApiProperty({ isArray: true, type: Number })
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  notificationsIds: number[];
}
