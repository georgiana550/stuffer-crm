import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/common/database/entities/user.entity';

export class LoginUserResponseDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  id: number;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  is_active: boolean;

  @ApiProperty()
  dialing_code: string;

  @ApiProperty()
  phone_number: string;

  @ApiProperty()
  email_verified: boolean;

  constructor(user: User) {
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.id = user.id;
    this.is_active = user.is_active;
    this.dialing_code = user.dialing_code || null;
    this.phone_number = user.phone_number || null;
    this.email_verified = user.email_verified || false;
  }
}
