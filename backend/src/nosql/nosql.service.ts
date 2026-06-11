import { Injectable, Optional } from '@nestjs/common';
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
    @Optional() @InjectModel(ActivityLog.name) private readonly activityLogModel?: Model<ActivityLog>,
    @Optional() @InjectModel(FileMetadata.name) private readonly fileMetadataModel?: Model<FileMetadata>,
    @Optional() @InjectModel(UsageStat.name) private readonly usageStatModel?: Model<UsageStat>,
  ) {}

  async logActivity(input: LogActivityInput): Promise<void> {
    if (!this.activityLogModel) {
      return;
    }

    try {
      await this.activityLogModel.create({
        userId: input.userId,
        email: input.email,
        action: input.action,
        targetType: input.targetType,
        targetId: input.targetId,
        metadata: input.metadata ?? {},
      });
    } catch {
      // MongoDB is optional for local REST/MySQL testing.
    }
  }

  async trackUsage(input: TrackUsageInput): Promise<void> {
    if (!this.usageStatModel) {
      return;
    }

    const today = new Date().toISOString().slice(0, 10);

    try {
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
    } catch {
      // MongoDB is optional for local REST/MySQL testing.
    }
  }

  createFileMetadata(input: CreateFileMetadataDto) {
    if (!this.fileMetadataModel) {
      return {
        ...input,
        metadata: input.metadata ?? {},
      };
    }

    return this.fileMetadataModel.create({
      ...input,
      metadata: input.metadata ?? {},
    });
  }

  findActivityLogs() {
    if (!this.activityLogModel) {
      return [];
    }

    return this.activityLogModel.find().sort({ createdAt: -1 }).limit(100).lean();
  }

  findFileMetadata() {
    if (!this.fileMetadataModel) {
      return [];
    }

    return this.fileMetadataModel.find().sort({ createdAt: -1 }).limit(100).lean();
  }

  findUsageStats() {
    if (!this.usageStatModel) {
      return [];
    }

    return this.usageStatModel.find().sort({ date: -1, count: -1 }).limit(100).lean();
  }
}
