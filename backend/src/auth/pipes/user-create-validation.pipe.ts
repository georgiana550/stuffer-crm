import { Injectable, PipeTransform } from '@nestjs/common';
import { BadRequestException } from 'src/common/exceptions/bad-request.exception';
import { UsersService } from 'src/common/users/users.service';
import { CreateUserRequestDto } from '../dto/create-user-request.dto';

@Injectable()
export class UserCreateValidationPipe implements PipeTransform {
  constructor(private usersService: UsersService) {}

  async transform(value: CreateUserRequestDto): Promise<CreateUserRequestDto> {
    const userEmail = await this.usersService.getUserByEmail(value.email);
    const userPhone = await this.usersService.getUserByPhone(
      value.phone_number,
    );

    if (userEmail || userPhone) {
      throw new BadRequestException(
        BadRequestException.ERROR_MESSAGE_DUPLICATE_USER,
        BadRequestException.ERROR_CODE_DUPLICATE_USER,
      );
    }

    return value;
  }
}
