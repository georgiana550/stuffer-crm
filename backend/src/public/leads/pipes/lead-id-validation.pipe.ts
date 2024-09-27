import { Injectable, PipeTransform } from '@nestjs/common';
import { NotFoundException } from 'src/common/exceptions/not-found.exception';
import { LeadsService } from 'src/common/leads/leads.service';

@Injectable()
export class LeadIdValidationPipe implements PipeTransform {
  constructor(private leadsService: LeadsService) {}

  async transform(value: number): Promise<number> {
    const lead = await this.leadsService.getLeadById(value);
    if (!lead) {
      throw new NotFoundException(
        NotFoundException.ERROR_MESSAGE_LEAD_NOT_FOUND,
        NotFoundException.ERROR_CODE_LEAD_NOT_FOUND,
      );
    }

    return value;
  }
}
