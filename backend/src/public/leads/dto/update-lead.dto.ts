import { PartialType } from '@nestjs/mapped-types';
import { CreateLeadRequestDto } from './create-lead-request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsIn } from 'class-validator';
import { statusCodesArray } from 'src/common/database/static/lead-statuses';

export class UpdateLeadRequestDto extends PartialType(CreateLeadRequestDto) {
  @ApiProperty()
  @IsOptional()
  @IsIn(statusCodesArray)
  status: string;
}
