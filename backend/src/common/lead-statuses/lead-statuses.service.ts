import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { LeadStatus } from '../database/entities/lead-status.entity';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class LeadStatusesService {
  constructor(
    @InjectRepository(LeadStatus)
    private leadStatusRepository: Repository<LeadStatus>,
  ) {}

  async getStatusByCode(code: string): Promise<LeadStatus> {
    const conditions: FindOptionsWhere<LeadStatus> = {
      code,
    };

    return this.leadStatusRepository.findOne({
      where: conditions,
      relations: [],
    });
  }
}
