import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { NosqlController } from './nosql.controller';
import { NosqlService } from './nosql.service';
import { ActivityLog, ActivityLogSchema } from './schemas/activity-log.schema';
import { FileMetadata, FileMetadataSchema } from './schemas/file-metadata.schema';
import { UsageStat, UsageStatSchema } from './schemas/usage-stat.schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI', 'mongodb://127.0.0.1:27017/gaming_rooms_nosql'),
      }),
    }),
    MongooseModule.forFeature([
      { name: ActivityLog.name, schema: ActivityLogSchema },
      { name: FileMetadata.name, schema: FileMetadataSchema },
      { name: UsageStat.name, schema: UsageStatSchema },
    ]),
  ],
  controllers: [NosqlController],
  providers: [NosqlService],
  exports: [NosqlService],
})
export class NosqlModule {}
