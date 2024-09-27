import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { UsersService } from 'src/common/users/users.service';
import { CreateLeadRequestDto } from './dto/create-lead-request.dto';
import { GetLeadsResponseDto } from './dto/get-leads-response.dto';
import { LeadResponseDto } from './dto/lead-response.dto';
import { UpdateLeadRequestDto } from './dto/update-lead.dto';
import { LeadsService } from './leads.service';
import { LeadIdValidationPipe } from './pipes/lead-id-validation.pipe';
import { LeadWriteValidationPipe } from './pipes/lead-write-validation.pipe';
import { DeleteLeadResponseDto } from './dto/delete-lead-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportLeadsRequestDto } from './dto/import-leads-request.dto';
import { FilesService } from 'src/common/files/files.service';
import { ImportLeadsResponseDto } from './dto/import-leads-response.dto';
import { PaginationDto } from './dto/pagination.dto';
import { FiltersDto } from './dto/filters.dto';

@Controller('leads')
export class LeadsController {
  constructor(
    private readonly leadsService: LeadsService,
    private readonly usersService: UsersService,
    private readonly filesService: FilesService,
  ) {}

  @Post('/:userId')
  @HttpCode(200)
  @ApiBody({ type: CreateLeadRequestDto })
  @ApiOkResponse({ type: LeadResponseDto })
  async createLead(
    @Body(LeadWriteValidationPipe) dto: CreateLeadRequestDto,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    const user = await this.usersService.shouldLogout(userId);
    const lead = await this.leadsService.createLead(dto, user);

    return new LeadResponseDto(lead);
  }

  @Post('/:userId/importLeads')
  @HttpCode(200)
  @ApiBody({ type: ImportLeadsRequestDto })
  @ApiOkResponse({ type: LeadResponseDto })
  @UseInterceptors(FileInterceptor('file'))
  async importLeads(
    // @Body() dto: ImportLeadsRequestDto,
    @Param('userId', ParseIntPipe) userId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user = await this.usersService.shouldLogout(userId);
    const fileRows = await this.filesService.processFile(file);
    const [leads, errorLines, duplicateLeadsLines] =
      await this.leadsService.importLeads(fileRows, user);

    return new ImportLeadsResponseDto(
      leads,
      errorLines,
      duplicateLeadsLines,
      file.originalname,
    );
  }

  @Get('/:userId/getLeads')
  @HttpCode(200)
  @ApiOkResponse({ type: LeadResponseDto })
  async getLeads(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() pagination: PaginationDto,
    @Query() filters: FiltersDto,
  ) {
    const user = await this.usersService.shouldLogout(userId);
    const [leads, leadsCount] = await this.leadsService.getLeads(
      user,
      pagination,
      filters,
    );

    return new GetLeadsResponseDto(leads, leadsCount);
  }

  @Get('/:userId/getLeads/:leadId')
  @HttpCode(200)
  @ApiOkResponse({ type: LeadResponseDto })
  async getLead(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('leadId', LeadIdValidationPipe) leadId: number,
  ) {
    const user = await this.usersService.shouldLogout(userId);
    const lead = await this.leadsService.getLeadById(leadId, user);
    return new LeadResponseDto(lead);
  }

  @Delete('/:userId/getLeads/:leadId')
  @HttpCode(200)
  async deleteLead(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('leadId', LeadIdValidationPipe) leadId: number,
  ) {
    const user = await this.usersService.shouldLogout(userId);
    await this.leadsService.deleteLeadById(leadId, user);
    return new DeleteLeadResponseDto(leadId);
  }

  @Put('/:userId/getLeads/:leadId')
  @HttpCode(200)
  @ApiOkResponse({ type: LeadResponseDto })
  async updateLead(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('leadId', LeadIdValidationPipe) leadId: number,
    @Body() dto: UpdateLeadRequestDto,
  ) {
    const user = await this.usersService.shouldLogout(userId);
    const lead = await this.leadsService.updateLead(leadId, user, dto);
    return new LeadResponseDto(lead);
  }
}
