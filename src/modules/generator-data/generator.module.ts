import { Module } from '@nestjs/common';
import { GeneratorController } from './generator.controller';
import { GenerationService } from './generation.service';

@Module({
  controllers: [GeneratorController],
  providers: [GenerationService],
  exports: [GenerationService],
})
export class GenerationModule {}
