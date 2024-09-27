import { Injectable } from '@nestjs/common';
import { Notification } from 'src/common/database/entities/notification.entity';
import { User } from 'src/common/database/entities/user.entity';
import { NotificationsService as CommonNotificationsService } from 'src/common/notifications/notifications.service';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class NotificationsService {
  constructor(private notificationsService: CommonNotificationsService) {}

  async getNotifications(
    user: User,
    pagination: PaginationDto,
  ): Promise<[Notification[], number, number, number]> {
    return this.notificationsService.getNotifications(user, pagination);
  }

  async getNotSeenNotifications(
    user: User,
    pagination: PaginationDto,
  ): Promise<[Notification[], number]> {
    return this.notificationsService.getNotSeenNotifications(user, pagination);
  }

  async changeToSeenNotifications(
    user: User,
    notificationsIds: number[],
  ): Promise<[Notification[], number, number]> {
    const notifications = await this.notificationsService.getNotificationsByIds(
      notificationsIds,
    );
    return this.notificationsService.changeToSeenNotifications(
      user,
      notifications,
    );
  }
}
