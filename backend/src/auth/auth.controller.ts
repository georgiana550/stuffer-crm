import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { User } from 'src/common/database/entities/user.entity';
import { UsersService } from 'src/common/users/users.service';
import { AuthService } from './auth.service';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { RegisterUserResponseDto } from './dto/create-user-response.dto';
import { LoginUserRequestDto } from './dto/login-request.dto';
import { LoginUserResponseDto } from './dto/login-response.dto';
import { LogoutUserRequestDto } from './dto/logout-request.dto';
import { ResendMailDto } from './dto/resend-mail.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { UserCreateValidationPipe } from './pipes/user-create-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  @HttpCode(200)
  @ApiBody({ type: LoginUserRequestDto })
  @ApiOkResponse({ type: LoginUserResponseDto })
  async login(@Body() dto: LoginUserRequestDto) {
    const user = await this.authService.loginUser(dto);

    return new LoginUserResponseDto(user);
  }

  @Post('logout')
  @HttpCode(200)
  @ApiBody({ type: LogoutUserRequestDto })
  async logout(@Body() dto: LogoutUserRequestDto) {
    await this.authService.logoutUser(dto);

    return { success: 'Logged out successfully' };
  }

  @Post('register')
  @HttpCode(200)
  @ApiBody({ type: CreateUserRequestDto })
  @ApiOkResponse({ type: RegisterUserResponseDto })
  async register(@Body(UserCreateValidationPipe) dto: CreateUserRequestDto) {
    const user = new User(
      dto.first_name,
      dto.last_name,
      dto.email,
      dto.password,
      'user',
      false,
      undefined,
      dto.dialing_code,
      dto.phone_number,
    );
    try {
      const token = await this.authService.generateToken(user); // generate token and save user
      const createdUser = await this.usersService.createUser(user);

      return new RegisterUserResponseDto(createdUser);
    } catch (error) {
      return { success: false };
    }
  }

  @Post('verify-email')
  async verify(@Body() body: VerifyUserDto) {
    const { token, email } = body;
    const verificationCode = await this.authService.findVerificationCodeByEmail(
      email,
    );
    if (verificationCode === token) {
      await this.authService.verifyUser(email);
      return { success: true };
    } else {
      console.log('Unable to verify user. Wrong verification code!!');
      return { success: false };
    }
  }

  @Post('resend-verification-code')
  async resendMail(@Body() body: ResendMailDto) {
    const email = body.email;
    const user = await this.authService.getUserByEmailOrPhone(email); // find the user for which we have to change the code
    const newToken = await this.authService.generateToken(user); // generate new code for that user
    this.authService.sendVerificationMail(email, newToken);
  }
}
