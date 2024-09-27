import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/common/database/entities/user.entity';

export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone_number: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  is_active: boolean;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.first_name = user.first_name;
    this.phone_number = user.phone_number;
    this.last_name = user.last_name;
    this.is_active = user.is_active;
  }
}
