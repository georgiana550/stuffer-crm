import { Injectable } from '@nestjs/common';
import { CreateCourseRequestDto } from './dto/create-course-request.dto';
import { Course } from 'src/common/database/entities/course.entity';
import { CoursesService as CommonCoursesService } from 'src/common/courses/courses.service';
import { UpdateCourseRequestDto } from './dto/update-course.dto';
import { PaginationDto } from './dto/pagination.dto';
import { FiltersDto } from './dto/filters.dto';

@Injectable()
export class CoursesService {
  constructor(private coursesService: CommonCoursesService) {}

  async createCourse(dto: CreateCourseRequestDto): Promise<Course> {
    const course = new Course(
      dto.name,
      dto.description,
      dto.location,
      dto.universityName,
      dto.startDate,
      dto.endDate,
      dto.additionalInformation,
    );
    return this.coursesService.createCourse(course);
  }

  async updateCourse(
    courseId: number,
    dto: UpdateCourseRequestDto,
  ): Promise<Course> {
    const course = await this.coursesService.getCourseById(courseId, [
      'leads',
      'leads.createdBy',
    ]);

    course.name = dto.name;
    course.description = dto.description;
    course.location = dto.location;
    course.startDate = dto.startDate;
    course.endDate = dto.endDate;
    course.additionalInformation = dto.additionalInformation;
    course.universityName = dto.universityName;

    return this.coursesService.createCourse(course);
  }

  async getCourses(
    userId: number,
    pagination: PaginationDto,
    filters: FiltersDto,
  ): Promise<[Course[], number]> {
    const [courses, coursesCount] = await this.coursesService.getCourses(
      pagination,
      filters,
      ['leads', 'leads.createdBy'],
    );
    const filteredCoursesLeads: Course[] = courses.map((course) => {
      course.leads = course.leads.filter((lead) => {
        if (lead.asigneeId === userId) return lead;
        if (!lead.asigneeId && lead.createdById === userId) return lead;
      });
      return course;
    });

    return [filteredCoursesLeads, coursesCount];
  }

  async getCourseById(id: number): Promise<Course> {
    const course = await this.coursesService.getCourseById(id);

    return course;
  }

  async deleteCourse(id: number): Promise<void> {
    await this.coursesService.deleteCourseById(id);
  }
}
