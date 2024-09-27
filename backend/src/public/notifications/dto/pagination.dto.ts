import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit: number = 10;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset: number = 0;
}
