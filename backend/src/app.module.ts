import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './common/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SettingsModule } from './common/settings/settings.module';
import { PublicModule } from './public/public.module';
import { MaintenanceMiddleware } from './common/settings/maintenance.middleware';
import { LeadsModule } from './common/leads/leads.module';
import { NotificationsModule } from './common/notifications/notifications.module';
import { LeadStatusesModule } from './common/lead-statuses/lead-statuses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${__dirname}/../.env`,
      isGlobal: true,
      expandVariables: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      autoLoadEntities: true,
      host: process.env.MYSQL_HOST,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: 3307,
      synchronize: process.env.ENVIRONMENT === 'dev' ? true : false,
    }),
    AuthModule,
    UsersModule,
    PublicModule,
    SettingsModule,
    LeadsModule,
    NotificationsModule,
    LeadStatusesModule,
  ],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(MaintenanceMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
