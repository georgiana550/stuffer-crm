import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { orderBy } from 'lodash';
import { Course } from 'src/common/database/entities/course.entity';
import { FiltersDto } from 'src/public/courses/dto/filters.dto';
import { PaginationDto } from 'src/public/courses/dto/pagination.dto';
import {
  FindManyOptions,
  FindOptionsWhere,
  In,
  Like,
  Repository,
} from 'typeorm';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  async createCourse(course: Course): Promise<Course> {
    return this.courseRepository.save(course);
  }

  async getCourses(
    pagination: PaginationDto,
    filters: FiltersDto,
    relations: string[],
  ): Promise<[Course[], number]> {
    const conditions: FindOptionsWhere<Course> = {};
    if (filters.location) {
      conditions.location = Like(`%${filters.location}%`);
    }

    if (filters.universityName) {
      conditions.universityName = Like(`%${filters.universityName}%`);
    }

    if (filters.name) {
      conditions.name = Like(`%${filters.name}%`);
    }

    const [unorderedCourses, totalCount] =
      await this.courseRepository.findAndCount({
        where: conditions,
        relations,
        take: pagination.limit,
        skip: pagination.offset,
      });
    const order = pagination.order === 'ASC' ? 'asc' : 'desc';
    const orderedCourses = orderBy(unorderedCourses, pagination.orderBy, order);

    return [orderedCourses, totalCount];
  }

  async getCourseById(id: number, relations?: string[]): Promise<Course> {
    const conditions: FindOptionsWhere<Course> = { id: id };

    return this.courseRepository.findOne({
      where: conditions,
      relations,
    });
  }

  async getCourseByName(name: string): Promise<Course> {
    const conditions: FindOptionsWhere<Course> = { name: name };

    return this.courseRepository.findOne({
      where: conditions,
    });
  }

  async deleteCourseById(id: number): Promise<void> {
    await this.courseRepository.delete(id);
  }

  async getCoursesByIds(ids: number[]): Promise<Course[]> {
    const conditions: FindOptionsWhere<Course> = { id: In(ids) };

    return this.courseRepository.find({
      where: conditions,
    });
  }
}
