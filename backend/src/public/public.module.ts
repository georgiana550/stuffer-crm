import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CoursesModule } from './courses/courses.module';
import { LeadsModule } from './leads/leads.module';
import { UsersModule } from './users/users.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    LeadsModule,
    CoursesModule,
    UsersModule,
    NotificationsModule,
    RouterModule.register([
      {
        path: '',
        module: LeadsModule,
      },
      {
        path: '',
        module: UsersModule,
      },
      {
        path: '',
        module: CoursesModule,
      },
      {
        path: '',
        module: NotificationsModule,
      },
    ]),
  ],
})
export class PublicModule {}
