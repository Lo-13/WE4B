import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, LogDocument } from './log.schema';
import { CreateLogDto } from './log.dto';

@Injectable()
export class LogsService {
  constructor(@InjectModel(Log.name) private logModel: Model<LogDocument>) {}

  async create(dto: CreateLogDto): Promise<Log> {
    const newLog = new this.logModel(dto);
    return newLog.save();
  }

  async findAll():Promise<Log[]> {
    return this.logModel
      .find() //retourne tous les logs
      .sort({ timestamp: -1 }) //trie par date decroissante
      .limit(100) //limite à 100 lgos
      .exec();
  }
  async getStatsBySalle(): Promise<any[]> {
    return this.logModel.aggregate([
      { $match: { action: 'SALLE_VIEWED' } },
      { $group: { _id: '$details.salleId', vues: { $sum: 1 } } },
      { $sort: { vues: -1 } },
    ]);
  }
}
