import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenerationModule } from 'modules/generator-data/generator.module';
import { StaffMember } from 'modules/staff-member/staffMember.entity';
import { StaffMemberModule } from 'modules/staff-member/staffMember.module';
import { CalculateModule } from 'modules/сalculator/calculate.module';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: join(__dirname, '..', process.env.DATABASE_PATH),
      entities: [StaffMember],
      synchronize: true,
    }),
    StaffMemberModule,
    GenerationModule,
    CalculateModule,
  ],
})
export class AppModule {}
