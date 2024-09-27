import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCourseRequestDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  universityName?: string | null;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date | null;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date | null;

  @IsOptional()
  @IsString()
  additionalInformation?: string | null;
}
