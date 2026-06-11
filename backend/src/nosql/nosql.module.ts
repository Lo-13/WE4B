import 'dotenv/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NosqlController } from './nosql.controller';
import { NosqlService } from './nosql.service';
import { ActivityLog, ActivityLogSchema } from './schemas/activity-log.schema';
import { FileMetadata, FileMetadataSchema } from './schemas/file-metadata.schema';
import { UsageStat, UsageStatSchema } from './schemas/usage-stat.schema';

const mongoUri = process.env.MONGO_URI?.trim();
const mongoImports = mongoUri
  ? [
      MongooseModule.forRoot(mongoUri, {
        serverSelectionTimeoutMS: 1000,
        bufferCommands: false,
      }),
      MongooseModule.forFeature([
        { name: ActivityLog.name, schema: ActivityLogSchema },
        { name: FileMetadata.name, schema: FileMetadataSchema },
        { name: UsageStat.name, schema: UsageStatSchema },
      ]),
    ]
  : [];

@Module({
  imports: mongoImports,
  controllers: [NosqlController],
  providers: [NosqlService],
  exports: [NosqlService],
})
export class NosqlModule {}
