import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  ParseIntPipe,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseRequestDto } from './dto/create-course-request.dto';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { CourseResponseDto } from './dto/course-response.dto';
import { UsersService } from 'src/common/users/users.service';
import { GetCoursesResponseDto } from './dto/get-courses-response.dto';
import { CourseIdValidationPipe } from './pipes/course-id-validation.pipe';
import { UpdateCourseRequestDto } from './dto/update-course.dto';
import { FiltersDto } from './dto/filters.dto';
import { PaginationDto } from './dto/pagination.dto';

@Controller('courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly usersService: UsersService,
  ) {}

  @Post('/:userId')
  @HttpCode(200)
  @ApiBody({ type: CreateCourseRequestDto })
  @ApiOkResponse({ type: CourseResponseDto })
  async createCourse(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: CreateCourseRequestDto,
  ) {
    await this.usersService.shouldLogout(userId);
    const course = await this.coursesService.createCourse(dto);

    return new CourseResponseDto(course);
  }

  @Get('/:userId/getCourses')
  @HttpCode(200)
  @ApiOkResponse({ type: CourseResponseDto })
  async getCourses(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() pagination: PaginationDto,
    @Query() filters: FiltersDto,
  ) {
    await this.usersService.shouldLogout(userId);
    const [courses, coursesCount] = await this.coursesService.getCourses(
      userId,
      pagination,
      filters,
    );

    return new GetCoursesResponseDto(courses, coursesCount);
  }

  @Get('/:userId/getCourses/:courseId')
  @HttpCode(200)
  @ApiOkResponse({ type: CourseResponseDto })
  async getCourse(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('courseId', CourseIdValidationPipe) courseId: number,
  ) {
    await this.usersService.shouldLogout(userId);
    const course = await this.coursesService.getCourseById(courseId);
    return new CourseResponseDto(course);
  }

  @Delete('/:userId/getCourses/:courseId')
  @HttpCode(200)
  async deleteCourse(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('courseId', CourseIdValidationPipe) courseId: number,
  ) {
    await this.usersService.shouldLogout(userId);
    await this.coursesService.deleteCourse(courseId);
  }

  @Put('/:userId/getCourses/:courseId')
  @HttpCode(200)
  @ApiOkResponse({ type: CourseResponseDto })
  async updateCourse(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('courseId', CourseIdValidationPipe) courseId: number,
    @Body() dto: UpdateCourseRequestDto,
  ) {
    await this.usersService.shouldLogout(userId);
    const course = await this.coursesService.updateCourse(courseId, dto);

    return new CourseResponseDto(course);
  }
}
