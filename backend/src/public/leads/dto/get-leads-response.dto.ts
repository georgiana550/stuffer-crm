import { ApiProperty } from '@nestjs/swagger';
import { Lead } from 'src/common/database/entities/lead.entity';
import { LeadResponseDto } from './lead-response.dto';

export class GetLeadsResponseDto {
  @ApiProperty()
  leadsCount: number;

  @ApiProperty({ type: [LeadResponseDto] })
  leads: LeadResponseDto[];

  constructor(leads: Lead[], leadsCount: number) {
    this.leadsCount = leadsCount;
    this.leads = leads.map((lead) => {
      return new LeadResponseDto(lead);
    });
  }
}
