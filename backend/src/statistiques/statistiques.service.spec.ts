import { Test, TestingModule } from '@nestjs/testing';
import { StatistiquesService } from './statistiques.service';

describe('StatistiquesService', () => {
  let service: StatistiquesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatistiquesService],
    }).compile();

    service = module.get<StatistiquesService>(StatistiquesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
