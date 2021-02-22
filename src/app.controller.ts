import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DigimonExtractor } from './core/extractors/digimon';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public getHello(): any {
    return DigimonExtractor.extract();
  }
}
