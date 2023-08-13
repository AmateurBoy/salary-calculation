import { Controller, Get } from '@nestjs/common';
import { GenerationService } from './generation.service';
import { StaffMemberService } from 'modules/staff-member/staffMember.service';

@Controller('generator')
export class GeneratorController {
  constructor(
    private readonly generationService: GenerationService,
    private readonly staffMemberService: StaffMemberService,
  ) {}

  @Get('/data')
  async generation() {
    const IsGeneration = this.generationService.isReadJsonFileTheSuccess(
      'C:/Users/march/Downloads/data-test-100-1y.json',
    );
    if (IsGeneration) {
      return this.staffMemberService.createMany(
        this.generationService.staffMembers,
      );
    } else {
      return 'Generation failed';
    }
  }
  @Get('/DI')
  async generationDI() {
    const allData = await this.staffMemberService.getAll();
    const updatedData = await this.generationService.dependencyGeneration(
      allData,
    );
    const updatedStaffMembers =
      this.staffMemberService.updateStaffMemberMany(updatedData);

    return updatedStaffMembers;
  }
}
