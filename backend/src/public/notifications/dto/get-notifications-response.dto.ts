import { ApiProperty } from '@nestjs/swagger';
import { Notification } from 'src/common/database/entities/notification.entity';
import { NotificationResponseDto } from './notification-response.dto';

export class GetNotificationsResponseDto {
  @ApiProperty()
  notificationsCount: number;

  @ApiProperty({ type: [NotificationResponseDto] })
  notifications: NotificationResponseDto[];

  @ApiProperty()
  totalUserNotifications: number;

  @ApiProperty()
  totalUserNotSeenNotifications: number;

  constructor(
    notifications: Notification[],
    notificationsCount: number,
    totalUserNotifications: number,
    totalUserNotSeenNotifications?: number,
  ) {
    this.notificationsCount = notificationsCount;
    this.notifications = notifications.map((notification) => {
      return new NotificationResponseDto(notification);
    });
    this.totalUserNotifications = totalUserNotifications;
    this.totalUserNotSeenNotifications = totalUserNotSeenNotifications || 0;
  }
}
