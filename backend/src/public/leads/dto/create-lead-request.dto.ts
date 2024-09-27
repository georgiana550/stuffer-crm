import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateLeadRequestDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  asigneeId?: number;

  @ApiProperty({ isArray: true, type: Number })
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  coursesIds: number[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  citizenship?: string | null;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth?: Date | null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  language?: string | null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  refereeName: string | null;
}
