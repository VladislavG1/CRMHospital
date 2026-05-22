import { Module } from '@nestjs/common';
import { AuditModule } from './audit/audit.module';
import { ErrorTrackerModule } from './error-tracker/error-tracker.module';

@Module({
  imports: [AuditModule, ErrorTrackerModule],
  controllers: [],
  providers: [],
})
export class AppModule { }