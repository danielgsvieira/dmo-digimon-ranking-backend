import { Test, TestingModule } from '@nestjs/testing';
import { DigimonService } from './digimon.service';

describe('DigimonService', () => {
  let service: DigimonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DigimonService],
    }).compile();

    service = module.get<DigimonService>(DigimonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
