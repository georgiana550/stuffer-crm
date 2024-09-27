import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from '../database/entities/setting.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private settingsRepository: Repository<Setting>,
  ) {}

  async getAllSettings(): Promise<Setting[]> {
    return this.settingsRepository.find();
  }

  async getSettingById(id: number): Promise<Setting> {
    return this.settingsRepository.findOne({ where: { id } });
  }
}
