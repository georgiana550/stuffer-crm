import { ApiProperty } from '@nestjs/swagger';

export class DeleteLeadResponseDto {
  @ApiProperty()
  leadId: number;

  constructor(leadId: number) {
    this.leadId = leadId;
  }
}
