import { ApiProperty } from '@nestjs/swagger';
import { Lead } from 'src/common/database/entities/lead.entity';
import { LeadResponseDto } from './lead-response.dto';

export class ImportLeadsResponseDto {
  @ApiProperty()
  createdLeads: LeadResponseDto[];

  @ApiProperty()
  importedLeadsCount: number;

  @ApiProperty()
  errorLines: number[];

  @ApiProperty()
  duplicateLines: number[];

  @ApiProperty()
  filename: string;

  constructor(
    leads: Lead[],
    errorLines: number[],
    duplicateLines: number[],
    filename: string,
  ) {
    this.createdLeads = leads.map((lead) => {
      return new LeadResponseDto(lead);
    });
    this.importedLeadsCount = leads.length;
    this.errorLines = errorLines;
    this.duplicateLines = duplicateLines;
    this.filename = filename;
  }
}
