import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFileMetadataDto } from './dto/create-file-metadata.dto';
import { ActivityLog } from './schemas/activity-log.schema';
import { FileMetadata } from './schemas/file-metadata.schema';
import { UsageStat } from './schemas/usage-stat.schema';

interface LogActivityInput {
  userId?: number;
  email?: string;
  action: string;
  targetType: string;
  targetId?: number;
  metadata?: Record<string, unknown>;
}

interface TrackUsageInput {
  type: string;
  roomId?: number;
  roomName?: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class NosqlService {
  constructor(
    @InjectModel(ActivityLog.name) private readonly activityLogModel: Model<ActivityLog>,
    @InjectModel(FileMetadata.name) private readonly fileMetadataModel: Model<FileMetadata>,
    @InjectModel(UsageStat.name) private readonly usageStatModel: Model<UsageStat>,
  ) {}

  async logActivity(input: LogActivityInput): Promise<void> {
    await this.activityLogModel.create({
      userId: input.userId,
      email: input.email,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId,
      metadata: input.metadata ?? {},
    });
  }

  async trackUsage(input: TrackUsageInput): Promise<void> {
    const today = new Date().toISOString().slice(0, 10);

    await this.usageStatModel.updateOne(
      {
        type: input.type,
        roomId: input.roomId,
        date: today,
      },
      {
        $setOnInsert: {
          type: input.type,
          roomId: input.roomId,
          roomName: input.roomName,
          date: today,
          metadata: input.metadata ?? {},
        },
        $inc: { count: 1 },
      },
      { upsert: true },
    );
  }

  createFileMetadata(input: CreateFileMetadataDto) {
    return this.fileMetadataModel.create({
      ...input,
      metadata: input.metadata ?? {},
    });
  }

  findActivityLogs() {
    return this.activityLogModel.find().sort({ createdAt: -1 }).limit(100).lean();
  }

  findFileMetadata() {
    return this.fileMetadataModel.find().sort({ createdAt: -1 }).limit(100).lean();
  }

  findUsageStats() {
    return this.usageStatModel.find().sort({ date: -1, count: -1 }).limit(100).lean();
  }
}
