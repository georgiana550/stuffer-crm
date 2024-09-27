import { IsNotEmpty, IsNumber } from 'class-validator';

export class UserRequestDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
