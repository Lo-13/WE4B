import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LogsModule } from './logs/logs.module';
import { StatistiquesModule } from './statistiques/statistiques.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/gamingrooms'),
    LogsModule,
    StatistiquesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
