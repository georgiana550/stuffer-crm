import { PartialType } from '@nestjs/swagger';
import { LoginUserRequestDto } from './login-request.dto';

export class LogoutUserRequestDto extends PartialType(LoginUserRequestDto) {}
