import { Injectable } from '@nestjs/common';
import { CreateLeadRequestDto } from './dto/create-lead-request.dto';
import { Lead } from 'src/common/database/entities/lead.entity';
import { User } from 'src/common/database/entities/user.entity';
import { UsersService } from 'src/common/users/users.service';
import { NotFoundException } from 'src/common/exceptions/not-found.exception';
import { CoursesService } from 'src/common/courses/courses.service';
import { LeadsService as CommonLeadsService } from 'src/common/leads/leads.service';
import { UpdateLeadRequestDto } from './dto/update-lead.dto';
import { BadRequestException } from 'src/common/exceptions/bad-request.exception';
import { difference, findIndex, uniq } from 'lodash';
import * as moment from 'moment';
import { PaginationDto } from './dto/pagination.dto';
import { FiltersDto } from './dto/filters.dto';
import { LeadStatusesService } from 'src/common/lead-statuses/lead-statuses.service';
import { LeadsStatusesCode } from 'src/common/database/static/lead-statuses';

@Injectable()
export class LeadsService {
  constructor(
    private coursesService: CoursesService,
    private leadsService: CommonLeadsService,
    private usersService: UsersService,
    private leadStatusesService: LeadStatusesService,
  ) {}

  async createLead(dto: CreateLeadRequestDto, user: User): Promise<Lead> {
    const courses = await this.coursesService.getCoursesByIds(dto.coursesIds);

    if (!courses || courses.length !== dto.coursesIds.length) {
      throw new NotFoundException(
        NotFoundException.ERROR_MESSAGE_COURSE_NOT_FOUND,
        NotFoundException.ERROR_CODE_COURSE_NOT_FOUND,
      );
    }

    const asignee = dto.asigneeId
      ? await this.usersService.getUserById(dto.asigneeId)
      : undefined;
    if (dto.asigneeId && !asignee) {
      throw new NotFoundException(
        NotFoundException.ERROR_MESSAGE_USER_NOT_FOUND +
          ' for the provided assigne',
        NotFoundException.ERROR_CODE_USER_NOT_FOUND,
      );
    }
    const newStatus = await this.leadStatusesService.getStatusByCode(
      LeadsStatusesCode.new,
    );

    const lead = new Lead(
      dto.fullName,
      dto.email,
      dto.phone,
      courses,
      user,
      newStatus,
      asignee,
      dto.refereeName,
      dto.dateOfBirth,
      dto.language,
      dto.citizenship,
    );
    return this.leadsService.createLead(lead);
  }

  async importLeads(
    leadsJson: object[],
    user: User,
  ): Promise<[Lead[], number[], number[]]> {
    const availableLeadColumnsObject =
      this.leadsService.getAllColumnsAsStringArray();
    const newStatus = await this.leadStatusesService.getStatusByCode(
      LeadsStatusesCode.new,
    );

    if (!availableLeadColumnsObject.includes('course'))
      availableLeadColumnsObject.push('course');

    let errorLines: number[] = [];
    let duplicateLeadsLines: number[] = [];
    let createdLeads: Lead[] = [];

    let object: any;
    for (object of leadsJson) {
      const objectColumns = Array.from(Object.keys(object));

      const notIncluedColumns = difference(
        objectColumns,
        availableLeadColumnsObject,
      );

      try {
        const email = object.email ? object.email : 'not-provided';
        const phone = object.phone ? object.phone : 'not-provided';

        if (email !== 'not-provided') {
          const leadByEmail = await this.leadsService.getLeadByEmail(email);
          if (leadByEmail) {
            duplicateLeadsLines.push(findIndex(leadsJson, object) + 2);
            continue;
          }
        }

        if (phone !== 'not-provided') {
          const leadByPhone = await this.leadsService.getLeadByPhone(phone);

          if (leadByPhone) {
            duplicateLeadsLines.push(findIndex(leadsJson, object) + 2);
            continue;
          }
        }

        const course = objectColumns.includes('course')
          ? [await this.coursesService.getCourseByName(object['course'])]
          : [];

        const fullName = object.fullName ? object.fullName : 'not-provided';

        const asignee = object.asigneeId
          ? await this.usersService.getUserByEmail(object.asigneeId)
          : null;

        const refereeName = object.refereeName ? object.refereeName : null;
        const dateOfBirth = object.dateOfBirth
          ? new Date(object.dateOfBirth)
          : null;

        const language = object.language ? object.language : null;
        const citizenship = object.citizenship ? object.citizenship : null;
        const source = object.source ? object.source : null;
        const submittedDate = object.submittedDate
          ? new Date(
              moment(object.submittedDate, 'DD.MM.YYYY, HH:mm').format(
                'YYYY-MM-DD HH:mm:ss',
              ),
            )
          : null;

        let additionalColumns = {};

        notIncluedColumns.forEach((key) => {
          if (object.hasOwnProperty(key)) {
            additionalColumns[key] = object[key];
          }
        });

        const lead = new Lead(
          fullName,
          email,
          phone,
          course,
          user,
          newStatus,
          asignee,
          refereeName,
          dateOfBirth,
          language,
          citizenship,
          additionalColumns,
          source,
          submittedDate,
        );
        if (lead) {
          const createdLead = await this.leadsService.createLead(lead);
          createdLeads.push(createdLead);
        }
      } catch {
        errorLines.push(findIndex(leadsJson, object) + 2);
      }
    }

    return [createdLeads, uniq(errorLines), uniq(duplicateLeadsLines)];
  }

  async getLeads(
    user: User,
    pagination: PaginationDto,
    filters: FiltersDto,
  ): Promise<[Lead[], number]> {
    const leadStatus = filters.status
      ? await this.leadStatusesService.getStatusByCode(filters.status)
      : undefined;

    const [leads, leadsCount] = await this.leadsService.getLeadsByUser(
      user,
      pagination,
      filters,
      leadStatus,
    );
    return [leads, leadsCount];
  }

  async getLeadById(leadId: number, user: User): Promise<Lead> {
    const lead = await this.leadsService.getLeadById(leadId);
    if (lead.asigneeId && lead.asigneeId !== user.id) {
      throw new BadRequestException(
        BadRequestException.ERROR_MESSAGE_INVALID_ASSIGNE,
        BadRequestException.ERROR_CODE_INVALID_ASSIGNE,
      );
    }

    return lead;
  }

  async deleteLeadById(leadId: number, user: User): Promise<void> {
    await this.getLeadById(leadId, user);
    await this.leadsService.deleteLeadById(leadId);
  }

  async updateLead(
    leadId: number,
    user: User,
    dto: UpdateLeadRequestDto,
  ): Promise<Lead> {
    const lead = await this.getLeadById(leadId, user);

    if (dto.email !== lead.email) {
      const lead = await this.leadsService.getLeadByEmail(dto.email);
      if (lead) {
        throw new BadRequestException(
          BadRequestException.ERROR_MESSAGE_DUPLICATE_LEAD_EMAIL,
          BadRequestException.ERROR_CODE_DUPLICATE_LEAD_EMAIL,
        );
      }
    }

    if (dto.phone !== lead.phone) {
      const lead = await this.leadsService.getLeadByPhone(dto.phone);
      if (lead) {
        throw new BadRequestException(
          BadRequestException.ERROR_MESSAGE_DUPLICATE_LEAD_PHONE,
          BadRequestException.ERROR_CODE_DUPLICATE_LEAD_PHONE,
        );
      }
    }

    const status = await this.leadStatusesService.getStatusByCode(dto.status);

    const updatedLead = await this.leadsService.updateLead(
      user,
      lead,
      status,
      dto,
    );

    return updatedLead;
  }
}
