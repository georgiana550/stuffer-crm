import { Injectable, PipeTransform } from '@nestjs/common';
import { CoursesService } from '../courses.service';
import { NotFoundException } from 'src/common/exceptions/not-found.exception';

@Injectable()
export class CourseIdValidationPipe implements PipeTransform {
  constructor(private coursesService: CoursesService) {}

  async transform(value: number): Promise<number> {
    const course = await this.coursesService.getCourseById(value);
    if (!course) {
      throw new NotFoundException(
        NotFoundException.ERROR_MESSAGE_COURSE_NOT_FOUND,
        NotFoundException.ERROR_CODE_COURSE_NOT_FOUND,
      );
    }

    return value;
  }
}
