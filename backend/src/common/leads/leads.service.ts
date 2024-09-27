import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { UpdateLeadRequestDto } from 'src/public/leads/dto/update-lead.dto';
import { FindOptionsWhere, IsNull, Like, Repository } from 'typeorm';
import { CoursesService } from '../courses/courses.service';
import { Lead } from '../database/entities/lead.entity';
import { User } from '../database/entities/user.entity';
import { UsersService } from '../users/users.service';
import { PaginationDto } from 'src/public/leads/dto/pagination.dto';
import { orderBy } from 'lodash';
import { FiltersDto } from 'src/public/leads/dto/filters.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { LeadStatus } from '../database/entities/lead-status.entity';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
    private coursesService: CoursesService,
    private usersService: UsersService,
    private notificationsService: NotificationsService,
  ) {}

  async getLeadsByUser(
    user: User,
    pagination: PaginationDto,
    filters: FiltersDto,
    status?: LeadStatus,
  ): Promise<[Lead[], number]> {
    const [leadsWithAssigneeIds, leadsWithAssigneeIdsCount] =
      await this.leadRepository.findAndCount({
        where: [
          {
            asigneeId: user.id,
            fullName: filters.fullName
              ? Like(`%${filters.fullName}%`)
              : undefined,
            email: filters.email ? Like(`%${filters.email}%`) : undefined,
            statusId: status ? status.id : undefined,
          },
        ],
        relations: ['courses', 'asignee', 'createdBy', 'status'],
      });

    const [leadsWithoutAssigneeIds, leadsWithoutAssigneeIdsCount] =
      await this.leadRepository.findAndCount({
        where: [
          {
            asigneeId: IsNull(),
            createdById: user.id,
            fullName: filters.fullName
              ? Like(`%${filters.fullName}%`)
              : undefined,
            email: filters.email ? Like(`%${filters.email}%`) : undefined,
            statusId: status ? status.id : undefined,
          },
        ],
        relations: ['courses', 'asignee', 'createdBy', 'status'],
      });
    const totalCount = leadsWithAssigneeIdsCount + leadsWithoutAssigneeIdsCount;
    const unorderedLeads = [
      ...leadsWithAssigneeIds,
      ...leadsWithoutAssigneeIds,
    ];

    const order = pagination.order === 'ASC' ? 'asc' : 'desc';
    const orderedLeads = orderBy(unorderedLeads, pagination.orderBy, order);
    const paginatedOrderedLeads = orderedLeads.slice(
      pagination.offset,
      pagination.offset + pagination.limit,
    );

    return [paginatedOrderedLeads, totalCount];
  }

  async deleteLeadById(leadId: number): Promise<void> {
    await this.leadRepository.delete(leadId);
  }

  async getLeadByEmail(email: string): Promise<Lead> {
    const conditions: FindOptionsWhere<Lead> = {
      email,
    };

    return this.leadRepository.findOne({
      where: conditions,
      relations: ['courses', 'asignee', 'createdBy'],
    });
  }

  async getLeadByPhone(phone: string): Promise<Lead> {
    const conditions: FindOptionsWhere<Lead> = {
      phone,
    };

    return this.leadRepository.findOne({
      where: conditions,
      relations: ['courses', 'asignee', 'createdBy'],
    });
  }

  getEntityColumns(): string[] {
    const lead: Lead = {
      fullName: '',
      email: '',
      phone: '',
      courses: [],
      createdBy: null,
      asignee: null,
      refereeName: '',
      dateOfBirth: null,
      language: '',
      citizenship: '',
      additionalColumns: null,
      source: null,
      id: 0,
      createdById: 0,
      asigneeId: 0,
      created_at: undefined,
      updated_at: undefined,
      submittedDate: undefined,
      status: undefined,
      statusId: 0,
    };

    return Object.keys(lead);
  }

  getAllColumnsAsStringArray(): string[] {
    const entityColumns: string[] = [];
    const entityMetadata = this.leadRepository.metadata;

    if (entityMetadata) {
      entityMetadata.columns.forEach((column) => {
        entityColumns.push(column.propertyName);
      });
    }

    return entityColumns;
  }

  async updateLead(
    user: User,
    lead: Lead,
    status: LeadStatus,
    dto: UpdateLeadRequestDto,
  ): Promise<Lead> {
    const actualCourses = lead.courses.map((course) => course.id);
    const sameCourses = _.isEqual(actualCourses, dto.coursesIds);

    const sameAsignee = _.isEqual(
      lead.asigneeId ?? undefined,
      dto.asigneeId ?? undefined,
    );
    const courses = sameCourses
      ? lead.courses
      : await this.coursesService.getCoursesByIds(dto.coursesIds);
    const asignee = sameAsignee
      ? lead.asignee
      : await this.usersService.getUserById(dto.asigneeId);

    lead.fullName = dto.fullName;
    lead.email = dto.email;
    lead.phone = dto.phone;
    lead.courses = courses;
    lead.asignee = asignee;
    lead.refereeName = dto.refereeName;
    lead.dateOfBirth = dto.dateOfBirth;
    lead.language = dto.language;
    lead.citizenship = dto.citizenship;
    lead.status = status;

    const updatedLead = await this.leadRepository.save(lead);

    if (updatedLead && !sameAsignee) {
      const oldAssigne = lead.asigneeId
        ? await this.usersService.getUserById(lead.asigneeId)
        : lead.createdBy;

      await this.notificationsService.newAssignedLeadNotification(
        user,
        asignee,
        updatedLead,
      );
    }

    return updatedLead;
  }

  async createLead(lead: Lead): Promise<Lead> {
    return this.leadRepository.save(lead);
  }

  async getLeadById(id: number): Promise<Lead> {
    const conditions: FindOptionsWhere<Lead> = { id: id };

    return this.leadRepository.findOne({
      where: conditions,
      relations: ['courses', 'asignee', 'createdBy'],
    });
  }
}
