import { Test, TestingModule } from '@nestjs/testing';
import { StatistiquesController } from './statistiques.controller';

describe('StatistiquesController', () => {
  let controller: StatistiquesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatistiquesController],
    }).compile();

    controller = module.get<StatistiquesController>(StatistiquesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
