import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/common/database/entities/user.entity';
import { UserResponseDto } from './user-response.dto';

export class GetUsersResponseDto {
  @ApiProperty()
  usersCount: number;

  @ApiProperty({ type: [UserResponseDto] })
  users: UserResponseDto[];

  constructor(users: User[], usersCount: number) {
    this.usersCount = usersCount;
    this.users = users.map((user) => {
      return new UserResponseDto(user);
    });
  }
}
