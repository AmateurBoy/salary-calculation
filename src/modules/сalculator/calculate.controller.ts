import { Controller, Get, Param } from '@nestjs/common';
import { StaffMemberService } from 'modules/staff-member/staffMember.service';
import { CalculateService } from './calculate.service';

@Controller('calculate')
export class CalculateController {
  constructor(
    private readonly calculateService: CalculateService,
    private readonly staffMemberService: StaffMemberService,
  ) {}
  //Calculate Endpoint
  @Get('/id/:id')
  async CalculationById(@Param('id') id: number) {
    const result =
      await this.staffMemberService.getStaffMemberWithDeepDependencies(id, 10);
    const resultCalculate = await this.calculateService.calculateSalary(
      result,
      new Date(),
    );
    return resultCalculate;
  }
  @Get('/full')
  async CalculationAll() {
    const resultCalculateSum =
      await this.calculateService.CalculateAllSalaryEmployee(new Date());
    return resultCalculateSum;
  }
}
