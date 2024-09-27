import { ApiProperty } from '@nestjs/swagger';
import { compact } from 'lodash';
import { Lead } from 'src/common/database/entities/lead.entity';
import { CourseResponseDto } from 'src/public/courses/dto/course-response.dto';

export class LeadResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  asigneeEmail: string;

  @ApiProperty()
  asigneeId: number;

  @ApiProperty()
  courses: CourseResponseDto[];

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  submittedDate: Date;

  @ApiProperty()
  status: string;

  @ApiProperty()
  citizenship?: string | null;

  @ApiProperty()
  dateOfBirth?: Date | null;

  @ApiProperty()
  language?: string | null;

  @ApiProperty()
  refereeName?: string | null;

  @ApiProperty()
  additionalColumns?: object;

  constructor(lead: Lead) {
    this.id = lead.id;
    this.asigneeEmail = lead.asignee ? lead.asignee.email : undefined;
    this.asigneeId = lead.asignee ? lead.asignee.id : undefined;
    this.courses = compact(
      lead.courses.map((course) => {
        if (course) return new CourseResponseDto(course);
      }),
    );
    this.createdBy = lead.createdBy.email;
    this.email = lead.email;
    this.fullName = lead.fullName;
    this.phone = lead.phone;
    this.submittedDate = lead.submittedDate;
    this.status = lead.status.code;
    this.citizenship = lead.citizenship || null;
    this.dateOfBirth = lead.dateOfBirth || null;
    this.language = lead.language || null;
    this.refereeName = lead.refereeName || null;
    this.additionalColumns = lead.additionalColumns || {};
  }
}
