import { IsEmail } from 'class-validator';

export class ResendMailDto {
  @IsEmail()
  email: string;
}
