import { ApiProperty } from '@nestjs/swagger';
import { Lead } from 'src/common/database/entities/lead.entity';

export class LeadCourseResponseDto {
  @ApiProperty()
  asigneeEmail: string;

  @ApiProperty()
  asigneeId: number;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  citizenship?: string | null;

  @ApiProperty()
  dateOfBirth?: Date | null;

  @ApiProperty()
  language?: string | null;

  @ApiProperty()
  refereeName?: string | null;

  constructor(lead: Lead) {
    this.asigneeEmail = lead.asignee ? lead.asignee.email : undefined;
    this.asigneeId = lead.asignee ? lead.asignee.id : undefined;
    this.createdBy = lead.createdBy.email;
    this.email = lead.email;
    this.fullName = lead.fullName;
    this.phone = lead.phone;
    this.citizenship = lead.citizenship || null;
    this.dateOfBirth = lead.dateOfBirth || null;
    this.language = lead.language || null;
    this.refereeName = lead.refereeName || null;
  }
}
