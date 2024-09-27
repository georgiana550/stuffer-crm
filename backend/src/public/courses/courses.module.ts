import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/common/database/entities/course.entity';
import { UsersModule } from 'src/common/users/users.module';
import { CoursesModule as CommonCoursesService } from 'src/common/courses/courses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course]),
    UsersModule,
    CommonCoursesService,
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
