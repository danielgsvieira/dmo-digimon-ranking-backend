import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DigimonExtractor } from './core/extractors/digimon';
import { RankExtractor } from './core/extractors/rank';
import { HttpClient } from './core/services/http-client';
import { DigimonModule } from './digimon/digimon.module';

@Module({
  imports: [DigimonModule],
  controllers: [AppController],
  providers: [AppService, DigimonExtractor, RankExtractor, HttpClient],
})
export class AppModule {}
