import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { NotFoundException } from '../exceptions/not-found.exception';
import { UnauthorizedException } from '../exceptions/unauthorized.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async saveUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async getUserByEmail(email: string) {

    return this.userRepository.findOne({
      where: { email: email },
      relations: ['leads'],
    });
  }

  async getUserByPhone(phone_number: string) {
    return this.userRepository.findOne({
      where: { phone_number: phone_number },
    });
  }

  async getUserById(id: number) {
    return this.userRepository.findOne({
      where: { id: id },
      relations: ['leads'],
    });
  }

  async getAllUsers(): Promise<[User[], number]> {
    return this.userRepository.findAndCount({});
  }

  async shouldLogout(userId: number): Promise<User> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new NotFoundException(
        NotFoundException.ERROR_MESSAGE_USER_NOT_FOUND,
        NotFoundException.ERROR_CODE_USER_NOT_FOUND,
      );
    }

    const updatedAtMoment = moment(user.updated_at);

    if (user.is_active) {
      const now = moment();
      const hours = Math.abs(updatedAtMoment.diff(now, 'hours'));

      if (hours >= 12) {
        user.is_active = false;
        await this.saveUser(user);
        throw new UnauthorizedException(
          UnauthorizedException.ERROR_MESSAGE_LOGIN_REQUIRED,
          UnauthorizedException.ERROR_CODE_LOGIN_REQUIRED,
        );
      }
    }

    if (!user.is_active) {
      throw new UnauthorizedException(
        UnauthorizedException.ERROR_MESSAGE_LOGIN_REQUIRED,
        UnauthorizedException.ERROR_CODE_LOGIN_REQUIRED,
      );
    }

    return user;
  }
}
