import { Module } from '@nestjs/common';
import { LeadStatusesService } from './lead-statuses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadStatus } from '../database/entities/lead-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LeadStatus])],
  controllers: [],
  providers: [LeadStatusesService],
  exports: [LeadStatusesService],
})
export class LeadStatusesModule {}
