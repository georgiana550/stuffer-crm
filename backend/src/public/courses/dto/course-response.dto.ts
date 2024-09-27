import { ApiProperty } from '@nestjs/swagger';
import { Course } from 'src/common/database/entities/course.entity';
import { LeadCourseResponseDto } from './lead-course-response.dto';

export class CourseResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  leads: LeadCourseResponseDto[];

  @ApiProperty()
  universityName?: string | null;

  @ApiProperty()
  startDate?: Date | null;

  @ApiProperty()
  endDate?: Date | null;

  @ApiProperty()
  additionalInformation?: string | null;

  constructor(course: Course) {
    this.id = course.id;
    this.name = course.name;
    this.description = course.description;
    this.location = course.location;
    this.universityName = course.universityName || null;
    this.startDate = course.startDate || null;
    this.endDate = course.endDate || null;
    this.additionalInformation = course.additionalInformation || null;
    this.leads = course.leads
      ? course.leads.map((lead) => new LeadCourseResponseDto(lead))
      : [];
  }
}
