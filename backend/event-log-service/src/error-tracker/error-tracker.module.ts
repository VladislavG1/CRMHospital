import { Module } from '@nestjs/common';
import { ErrorTrackerService } from './error-tracker.service';
import { ErrorTrackerController } from './error-tracker.controller';
import { PrismaService } from '../prisma.service';

@Module({
    controllers: [ErrorTrackerController],
    providers: [ErrorTrackerService, PrismaService],
    exports: [ErrorTrackerService]
})
export class ErrorTrackerModule { }