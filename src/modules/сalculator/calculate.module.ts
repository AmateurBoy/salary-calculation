import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffMember } from 'modules/staff-member/staffMember.entity';
import { StaffMemberService } from 'modules/staff-member/staffMember.service';
import { CalculateController } from './calculate.controller';
import { CalculateService } from './calculate.service';

@Module({
  imports: [TypeOrmModule.forFeature([StaffMember])],
  controllers: [CalculateController],
  providers: [CalculateService, StaffMemberService],
  exports: [CalculateService, StaffMemberService],
})
export class CalculateModule {}
