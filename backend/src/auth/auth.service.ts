import { Injectable } from '@nestjs/common';
import { UsersService } from '../common/users/users.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/database/entities/user.entity';
import * as crypto from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';
import { LoginUserRequestDto } from './dto/login-request.dto';
import { BadRequestException } from 'src/common/exceptions/bad-request.exception';
import * as bcrypt from 'bcryptjs';
import { LogoutUserRequestDto } from './dto/logout-request.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private mailerService: MailerService,
    private usersService: UsersService,
  ) {}

  async generateToken(user: User): Promise<string> {
    const token = crypto.randomBytes(20).toString('hex');
    user.verification_code = token;
    return token;
  }

  async generateVerficationLink(token: string, email: string): Promise<String> {
    return `http://localhost:3000/verify-email?token=${token}&email=${encodeURIComponent(
      email,
    )}`;
  }

  async findVerificationCodeByEmail(email: string): Promise<string> {
    const user = await this.userRepository.findOne({
      where: [{ email: email }],
    });
    return user.verification_code;
  }

  async getUserByEmailOrPhone(phoneOrEmail: string) {
    const user = await this.userRepository.findOne({
      where: [
        { phone_number: phoneOrEmail },
        { email: phoneOrEmail.toLowerCase() },
      ],
    });
    return user;
  }

  async validatePassword(
    password: string,
    actualPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, actualPassword);
  }

  async loginUser(dto: LoginUserRequestDto): Promise<User> {
    const user = await this.usersService.getUserByEmail(dto.email);
    if (!user) {
      throw new BadRequestException(
        BadRequestException.ERROR_MESSAGE_INVALID_CREDENTIALS,
        BadRequestException.ERROR_CODE_INVALID_CREDENTIALS,
      );
    }

    const validPwd = await this.validatePassword(dto.password, user.password);
    if (!validPwd) {
      throw new BadRequestException(
        BadRequestException.ERROR_MESSAGE_INVALID_CREDENTIALS,
        BadRequestException.ERROR_CODE_INVALID_CREDENTIALS,
      );
    }

    user.is_active = true;
    await this.usersService.saveUser(user);
    return user;
  }

  async logoutUser(dto: LogoutUserRequestDto): Promise<void> {
    const user = await this.usersService.getUserByEmail(dto.email);
    if (!user) {
      throw new BadRequestException(
        BadRequestException.ERROR_MESSAGE_INVALID_CREDENTIALS,
        BadRequestException.ERROR_CODE_INVALID_CREDENTIALS,
      );
    }
    user.is_active = false;
    await this.usersService.saveUser(user);
    return;
  }

  async sendVerificationMail(email: string, token: string) {
    const verificationLink = await this.generateVerficationLink(token, email);

    await this.mailerService.sendMail({
      to: email,
      from: 'Sharmatushar0k@gmail.com',
      subject: 'Email Verification',
      text: `Please use this link to verify your email ${verificationLink}`,
    });
  }

  async verifyUser(email: string) {
    const user = await this.userRepository.findOne({
      where: [{ email: email }],
    });
    user.email_verified = true;
    await this.userRepository.save(user);
  }
}
