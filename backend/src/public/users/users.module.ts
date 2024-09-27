import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/common/database/entities/user.entity';
import { UsersModule as CommonUsersModule } from 'src/common/users/users.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CommonUsersModule, UsersModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
