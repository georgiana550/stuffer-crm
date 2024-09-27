import {
  Controller,
  Get,
  Param,
  HttpCode,
  ParseIntPipe,
  Put,
  Body,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService as CommonUsersService } from 'src/common/users/users.service';
import { GetUsersResponseDto } from './dto/get-users-response.dto';
import { UsersService } from './users.service';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';

@Controller('users')
export class UsersController {
  constructor(
    private commonUsersService: CommonUsersService,
    private usersService: UsersService,
  ) {}

  @Get('/:userId/getUsers')
  @HttpCode(200)
  @ApiOkResponse({ type: UserResponseDto })
  async getUsers(@Param('userId', ParseIntPipe) userId: number) {
    await this.commonUsersService.shouldLogout(userId);
    const [users, usersCount] = await this.usersService.getAllUsers();

    return new GetUsersResponseDto(users, usersCount);
  }

  @Get('/:userId/getUsers/:userToSearch')
  @HttpCode(200)
  @ApiOkResponse({ type: UserResponseDto })
  async getUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('userToSearch') userToSearch: number,
  ) {
    await this.commonUsersService.shouldLogout(userId);
    const searchedUser = await this.usersService.getUserById(userToSearch);
    return new UserResponseDto(searchedUser);
  }

  @Put('/:userId/updateUser')
  @HttpCode(200)
  @ApiOkResponse({ type: UserResponseDto })
  async updateUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: UpdateUserRequestDto,
  ) {
    await this.commonUsersService.shouldLogout(userId);
    const updatedUser = await this.usersService.updateUser(userId, dto);
    return new UserResponseDto(updatedUser);
  }
}
