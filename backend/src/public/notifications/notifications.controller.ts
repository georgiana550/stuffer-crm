import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { UsersService } from 'src/common/users/users.service';
import { GetNotificationsResponseDto } from './dto/get-notifications-response.dto';

import { NotificationResponseDto } from './dto/notification-response.dto';
import { NotificationsService } from './notifications.service';
import { SeeNotificationsDto } from './dto/create-lead-request.dto';
import { PaginationDto } from './dto/pagination.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
  ) {}

  @Get('/:userId')
  @HttpCode(200)
  @ApiOkResponse({ type: GetNotificationsResponseDto })
  async getNotifications(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() pagination: PaginationDto,
  ) {
    const user = await this.usersService.shouldLogout(userId);
    const [
      notifications,
      notificationsCount,
      totalUserNotSeenNotifications,
      totalUserNotifications,
    ] = await this.notificationsService.getNotifications(user, pagination);

    return new GetNotificationsResponseDto(
      notifications,
      notificationsCount,
      totalUserNotifications,
      totalUserNotSeenNotifications,
    );
  }

  @Get('/:userId')
  @HttpCode(200)
  @ApiOkResponse({ type: GetNotificationsResponseDto })
  async getNotSeenNotifications(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() pagination: PaginationDto,
    @Query() notSeen?: boolean,
  ) {
    const user = await this.usersService.shouldLogout(userId);
    const [notifications, notificationsCount, totalUserNotSeenNotifications] =
      notSeen && notSeen === true
        ? await this.notificationsService.getNotSeenNotifications(
            user,
            pagination,
          )
        : await this.notificationsService.getNotifications(user, pagination);

    return new GetNotificationsResponseDto(
      notifications,
      notificationsCount,
      totalUserNotSeenNotifications,
    );
  }

  @Put('/:userId/seeNotifications')
  @HttpCode(200)
  @ApiOkResponse({ type: NotificationResponseDto })
  async changeToSeenNotifications(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: SeeNotificationsDto,
  ) {
    const user = await this.usersService.shouldLogout(userId);
    if (dto.notificationsIds.length > 0) {
      const [
        seenNotifications,
        seenNotificationsCount,
        totalUserNotSeenNotifications,
      ] = await this.notificationsService.changeToSeenNotifications(
        user,
        dto.notificationsIds,
      );

      return new GetNotificationsResponseDto(
        seenNotifications,
        totalUserNotSeenNotifications,
        seenNotificationsCount,
      );
    } else return [{}, 0, 0];
  }
}
