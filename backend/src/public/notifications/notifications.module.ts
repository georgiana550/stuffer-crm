import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/common/database/entities/notification.entity';
import { UsersModule } from 'src/common/users/users.module';
import { CoursesModule } from '../courses/courses.module';
import { NotificationsModule as CommonNotificationsModule } from 'src/common/notifications/notifications.module';
import { FilesModule } from 'src/common/files/files.module';
import { NotificationsController } from './notifications.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    CommonNotificationsModule,
    UsersModule,
    CoursesModule,
    FilesModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
