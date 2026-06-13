import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminRequestEntity} from './admin-request.entity';
import { AdminRequestService } from './admin-request.service';
import { AdminRequestController } from './admin-request.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AdminRequestEntity])],
  controllers: [AdminRequestController],
  providers: [AdminRequestService]
  })
    export class AdminRequestModule {}