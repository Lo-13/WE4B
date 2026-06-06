import { Module } from '@nestjs/common';
import { StatistiquesController } from './statistiques.controller';
import { StatistiquesService } from './statistiques.service';

@Module({
  controllers: [StatistiquesController],
  providers: [StatistiquesService]
})
export class StatistiquesModule {}
