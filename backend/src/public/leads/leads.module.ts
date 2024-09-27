import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from 'src/common/database/entities/lead.entity';
import { UsersModule } from 'src/common/users/users.module';
import { Course } from 'src/common/database/entities/course.entity';
import { CoursesModule } from '../courses/courses.module';
import { CoursesModule as CommonCoursesModule } from 'src/common/courses/courses.module';
import { LeadsModule as CommonLeadsModule } from 'src/common/leads/leads.module';
import { FilesModule } from 'src/common/files/files.module';
import { LeadStatusesModule } from 'src/common/lead-statuses/lead-statuses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lead, Course]),
    CommonCoursesModule,
    CommonLeadsModule,
    UsersModule,
    CoursesModule,
    FilesModule,
    LeadStatusesModule,
  ],
  controllers: [LeadsController],
  providers: [LeadsService],
})
export class LeadsModule {}
