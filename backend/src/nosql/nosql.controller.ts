import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateFileMetadataDto } from './dto/create-file-metadata.dto';
import { NosqlService } from './nosql.service';

@Controller('nosql')
export class NosqlController {
  constructor(private readonly nosqlService: NosqlService) {}

  @Get('logs')
  findActivityLogs() {
    return this.nosqlService.findActivityLogs();
  }

  @Get('files')
  findFileMetadata() {
    return this.nosqlService.findFileMetadata();
  }

  @Get('stats')
  findUsageStats() {
    return this.nosqlService.findUsageStats();
  }

  @Post('files')
  createFileMetadata(@Body() createFileMetadataDto: CreateFileMetadataDto) {
    return this.nosqlService.createFileMetadata(createFileMetadataDto);
  }
}
