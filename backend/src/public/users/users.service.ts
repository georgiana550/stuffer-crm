import { Injectable } from '@nestjs/common';
import { User } from 'src/common/database/entities/user.entity';
import { NotFoundException } from 'src/common/exceptions/not-found.exception';
import { UsersService as CommonUsersService } from 'src/common/users/users.service';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { BadRequestException } from 'src/common/exceptions/bad-request.exception';

@Injectable()
export class UsersService {
  constructor(private usersService: CommonUsersService) {}

  async getAllUsers(): Promise<[User[], number]> {
    const [users, usersCount] = await this.usersService.getAllUsers();
    return [users, usersCount];
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.usersService.getUserById(id);

    if (!user) {
      throw new NotFoundException(
        NotFoundException.ERROR_MESSAGE_USER_NOT_FOUND,
        NotFoundException.ERROR_CODE_USER_NOT_FOUND,
      );
    }
    return user;
  }

  async updateUser(id: number, dto: UpdateUserRequestDto): Promise<User> {
    const user = await this.usersService.getUserById(id);

    if (!user) {
      throw new NotFoundException(
        NotFoundException.ERROR_MESSAGE_USER_NOT_FOUND,
        NotFoundException.ERROR_CODE_USER_NOT_FOUND,
      );
    }

    if (user.phone_number !== dto.phone_number) {
      const userByPhone = await this.usersService.getUserByPhone(
        dto.phone_number,
      );

      if (userByPhone)
        throw new BadRequestException(
          BadRequestException.ERROR_MESSAGE_DUPLICATE_USER,
          BadRequestException.ERROR_CODE_DUPLICATE_USER,
        );
    }

    if (user.email !== dto.email) {
      const userByEmail = await this.usersService.getUserByEmail(dto.email);

      if (userByEmail)
        throw new BadRequestException(
          BadRequestException.ERROR_MESSAGE_DUPLICATE_USER,
          BadRequestException.ERROR_CODE_DUPLICATE_USER,
        );
    }
    user.email = dto.email;
    user.first_name = dto.first_name;
    user.last_name = dto.last_name;
    user.phone_number = dto.phone_number;

    return this.usersService.saveUser(user);
  }
}
