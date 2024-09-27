import { ApiProperty } from '@nestjs/swagger';
import { Notification } from 'src/common/database/entities/notification.entity';

export class NotificationResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  seen: boolean;

  @ApiProperty()
  created_at: Date;

  constructor(notification: Notification) {
    this.id = notification.id;
    this.message = notification.message;
    this.seen = notification.seen;
    this.created_at = notification.created_at;
  }
}
