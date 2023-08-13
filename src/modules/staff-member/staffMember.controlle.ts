import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { StaffMemberService } from './staffMember.service';
import { StaffMember } from 'modules/staff-member/staffMember.entity';
import { Logger } from '@nestjs/common';

@Controller('staffmember')
export class StaffMemberController {
  constructor(private readonly staffMemberService: StaffMemberService) {}

  @Get('/id/:id')
  async GetById(@Param('id') id: number): Promise<StaffMember> {
    return this.staffMemberService.getById(id);
  }
  @Get('/full/id/:id')
  async GetByIdFull(@Param('id') id: number): Promise<StaffMember> {
    return this.staffMemberService.getStaffMemberWithDeepDependencies(id, 20);
  }
  @Get('/all')
  async GetAll(): Promise<StaffMember[]> {
    return this.staffMemberService.getAll();
  }
  @Get('/all/:type')
  async GetAllType(@Param('type') type: string): Promise<StaffMember[]> {
    return this.staffMemberService.getAllByType(type);
  }
  @Get('/filtr')
  async Filtr(@Query() filters: any) {
    return this.staffMemberService.getAllFiltr(filters);
  }
  @Post()
  async Create(@Body() user: StaffMember): Promise<StaffMember> {
    return this.staffMemberService.create(user);
  }
  @Post('/many')
  async CreateMany(@Body() users: StaffMember[]): Promise<StaffMember[]> {
    return this.staffMemberService.createMany(users);
  }
  @Put('/update')
  async Update(@Body() user: StaffMember) {
    return this.staffMemberService.updateStaffMember(user);
  }
  @Delete(':id')
  async Delete(@Param('id') id: number): Promise<void> {
    Logger.log('del');
    this.staffMemberService.DelateById(id);
  }
}
