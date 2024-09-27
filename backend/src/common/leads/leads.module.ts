import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesModule } from '../courses/courses.module';
import { Course } from '../database/entities/course.entity';
import { Lead } from '../database/entities/lead.entity';
import { UsersModule } from '../users/users.module';
import { LeadsService } from './leads.service';
import { Source } from '../database/entities/source.entity';
import { Notification } from '../database/entities/notification.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lead, Course, Source, Notification]),
    CoursesModule,
    UsersModule,
    NotificationsModule,
  ],
  controllers: [],
  providers: [LeadsService],
  exports: [LeadsService],
})
export class LeadsModule {}
