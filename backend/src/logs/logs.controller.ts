import { Controller, Get, Post, Body } from '@nestjs/common';
import { LogsService } from './logs.service';
import { CreateLogDto } from './log.dto';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post()
  async create(@Body() dto: CreateLogDto) {

    await this.logsService.create(dto);
    return { status: 'OK' };
  }

  @Get()
  async findAll() {
    return this.logsService.findAll();
  }


  @Get('stats')
  async getStats() {
    return this.logsService.getStatsBySalle();
  }
}