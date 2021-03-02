import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DigimonExtractor } from './core/extractors/digimon';
import { RankExtractor } from './core/extractors/rank';
import { Digimon } from './core/models/digimon';
import { Rank } from './core/models/rank';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private digimonExtractor: DigimonExtractor,
    private rankExtractor: RankExtractor,
  ) {}

  @Get('digimon')
  public getDigimons(): Promise<Digimon[]> {
    return this.digimonExtractor.extract();
  }

  @Get('rank')
  public getRanks(): Promise<Rank[]> {
    return this.rankExtractor.extract();
  }
}
