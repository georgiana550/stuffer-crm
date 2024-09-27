import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { SettingId } from '../database/static/setting';
import { ServiceUnavailableException } from '../exceptions/service-unavailable.exception';
import { SettingsService } from './settings.service';

@Injectable()
export class MaintenanceMiddleware implements NestMiddleware {
  constructor(private settingsService: SettingsService) {}

  async use(_req: Request, _res: Response, next: () => void): Promise<void> {
    const maintenanceSetting = await this.settingsService.getSettingById(
      SettingId.maintenance,
    );

    if (maintenanceSetting?.value === '1') {
      throw new ServiceUnavailableException(
        ServiceUnavailableException.ERROR_MESSAGE_DEFAULT,
        ServiceUnavailableException.ERROR_CODE_DEFAULT,
      );
    }

    next();
  }
}
