import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { Lead } from '../database/entities/lead.entity';
import { User } from '../database/entities/user.entity';
import { Notification } from '../database/entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PaginationDto } from 'src/public/notifications/dto/pagination.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async newAssignedLeadNotification(
    fromUser: User,
    toUser: User,
    leadAssigned: Lead,
  ): Promise<Notification> {
    const notification = new Notification(
      `${fromUser.email} assigned you new lead: ${leadAssigned.fullName}`,
      toUser,
      false,
    );

    return this.saveNotification(notification);
  }

  async saveNotification(notification: Notification): Promise<Notification> {
    return this.notificationRepository.save(notification);
  }

  async getNotifications(
    user: User,
    pagination: PaginationDto,
  ): Promise<[Notification[], number, number, number]> {
    const [notifications, totalUserNotifications] =
      await this.notificationRepository.findAndCount({
        where: [
          {
            user: { id: user.id },
          },
        ],
        take: pagination.limit,
        skip: pagination.offset,
        order: { created_at: 'DESC' },
        relations: ['user'],
      });
    
    const totalUserNotSeenNotifications =
      await this.notificationRepository.count({
        where: [
          {
            user: { id: user.id },
            seen: false,
          },
        ],
      });

    return [
      notifications,
      notifications.length,
      totalUserNotSeenNotifications,
      totalUserNotifications,
    ];
  }

  async getNotSeenNotifications(
    user: User,
    pagination: PaginationDto,
  ): Promise<[Notification[], number]> {
    const notifications = await this.notificationRepository.find({
      where: [
        {
          user: { id: user.id },
          seen: false,
        },
      ],
      take: pagination.limit,
      skip: pagination.offset,
      relations: ['user'],
    });

    return [notifications, notifications.length];
  }

  async changeToSeenNotifications(
    user: User,
    notifications: Notification[],
  ): Promise<[Notification[], number, number]> {
    let newNotifications: Notification[] = [];

    for (const notification of notifications) {
      const seen: Notification = { ...notification, seen: true };
      const seenNotification = await this.saveNotification(seen);
      newNotifications.push(seenNotification);
    }
    const totalUserNotSeenNotifications =
      await this.notificationRepository.count({
        where: [
          {
            user: { id: user.id },
            seen: false,
          },
        ],
      });
    return [
      newNotifications,
      newNotifications.length,
      totalUserNotSeenNotifications,
    ];
  }

  async getNotificationsByIds(
    notificationsIds: number[],
  ): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: [
        {
          id: In(notificationsIds),
        },
      ],
      relations: ['user'],
    });
  }
}
