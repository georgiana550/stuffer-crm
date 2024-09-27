import { Injectable, PipeTransform } from '@nestjs/common';
import { LeadsService } from 'src/common/leads/leads.service';
import { CreateLeadRequestDto } from '../dto/create-lead-request.dto';
import { BadRequestException } from 'src/common/exceptions/bad-request.exception';

@Injectable()
export class LeadWriteValidationPipe implements PipeTransform {
  constructor(private leadsService: LeadsService) {}

  async transform(value: CreateLeadRequestDto): Promise<CreateLeadRequestDto> {
    const leadEmail = await this.leadsService.getLeadByEmail(value.email);
    const leadPhone = await this.leadsService.getLeadByPhone(value.phone);

    if (leadEmail) {
      throw new BadRequestException(
        BadRequestException.ERROR_MESSAGE_DUPLICATE_LEAD_EMAIL,
        BadRequestException.ERROR_CODE_DUPLICATE_LEAD_EMAIL,
      );
    }

    if (leadPhone) {
      throw new BadRequestException(
        BadRequestException.ERROR_MESSAGE_DUPLICATE_LEAD_PHONE,
        BadRequestException.ERROR_CODE_DUPLICATE_LEAD_PHONE,
      );
    }

    return value;
  }
}
