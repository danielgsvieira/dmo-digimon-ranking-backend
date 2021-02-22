import { Test, TestingModule } from '@nestjs/testing';
import { DigimonController } from './digimon.controller';

describe('DigimonController', () => {
  let controller: DigimonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DigimonController],
    }).compile();

    controller = module.get<DigimonController>(DigimonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
