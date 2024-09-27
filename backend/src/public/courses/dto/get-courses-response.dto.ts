import { ApiProperty } from '@nestjs/swagger';
import { Course } from 'src/common/database/entities/course.entity';
import { CourseResponseDto } from './course-response.dto';

export class GetCoursesResponseDto {
  @ApiProperty()
  coursesCount: number;

  @ApiProperty({ type: [CourseResponseDto] })
  courses: CourseResponseDto[];

  constructor(courses: Course[], coursesCount: number) {
    this.coursesCount = coursesCount;
    this.courses = courses.map((course) => {
      return new CourseResponseDto(course);
    });
  }
}
