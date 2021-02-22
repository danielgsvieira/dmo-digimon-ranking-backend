import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DigimonModule } from './digimon/digimon.module';

@Module({
  imports: [DigimonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
