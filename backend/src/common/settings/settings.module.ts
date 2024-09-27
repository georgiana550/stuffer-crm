import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting } from '../database/entities/setting.entity';
import { SettingsService } from './settings.service';

@Module({
    imports: [TypeOrmModule.forFeature([Setting])],
    providers: [SettingsService],
    exports: [SettingsService],
})
export class SettingsModule {}
