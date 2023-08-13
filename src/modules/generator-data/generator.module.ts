import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeneratorController } from './generator.controller';
import { GenerationService } from './generation.service';
import { StaffMember } from 'modules/staff-member/staffMember.entity';
import { StaffMemberService } from 'modules/staff-member/staffMember.service';

@Module({
  imports: [TypeOrmModule.forFeature([StaffMember])],
  controllers: [GeneratorController],
  providers: [GenerationService, StaffMemberService],
  exports: [GenerationService],
})
export class GenerationModule {}
