import { StaffMember } from './staffMember.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StaffMemberService {
  constructor(
    @InjectRepository(StaffMember)
    private readonly staffMemberRepository: Repository<StaffMember>,
  ) {}

  async create(obj: StaffMember): Promise<StaffMember> {
    const staffMember = this.staffMemberRepository.create(obj);
    return this.staffMemberRepository.save(staffMember);
  }
  async createMany(obj: StaffMember[]): Promise<StaffMember[]> {
    return this.staffMemberRepository.save(obj);
  }
  async getAll(): Promise<StaffMember[]> {
    return this.staffMemberRepository.find();
  }
  async getAllByType(type: string): Promise<StaffMember[]> {
    return this.staffMemberRepository.find({
      where: {
        type: type,
      },
    });
  }
  async getById(id: number): Promise<StaffMember> {
    return this.staffMemberRepository.findOneById(id);
  }
  async getAllFiltr(typeParams: any) {
    const query = this.staffMemberRepository.createQueryBuilder('staffMember');

    if (typeParams.type) {
      query.andWhere('staffMember.type = :type', { type: typeParams.type });
    }

    if (typeParams.joinDate) {
      query.andWhere('staffMember.joinDate = :joinDate', {
        joinDate: typeParams.joinDate,
      });
    }
    if (typeParams.count) {
      query.take(typeParams.count);
    }

    // Добавьте другие параметры фильтрации по вашим требованиям
    return query.getMany();
  }
  async getStaffMemberWithDeepDependencies(
    id: number,
    depth: number,
  ): Promise<StaffMember | undefined> {
    if (depth <= 0) {
      return await this.staffMemberRepository.findOneById(id);
    }
    const staffMemberWithRelations = await this.staffMemberRepository
      .createQueryBuilder('staffMember')
      .leftJoinAndSelect('staffMember.supervisor', 'supervisor')
      .leftJoinAndSelect('staffMember.subordinates', 'subordinates')
      .where('staffMember.id = :id', { id })
      .getOne();

    const listMembers: StaffMember[] = [];

    if (staffMemberWithRelations !== null) {
      for (const nextLevelStaffMember of staffMemberWithRelations.subordinates) {
        const nextLevelMember = await this.getStaffMemberWithDeepDependencies(
          nextLevelStaffMember.id,
          depth - 1,
        );
        listMembers.push(nextLevelMember);
      }
      staffMemberWithRelations.subordinates = listMembers;
    }
    return staffMemberWithRelations;
  }
  async updateStaffMember(
    updatedData: Partial<StaffMember>,
  ): Promise<StaffMember> {
    const updatedStaffMember = await this.staffMemberRepository.save(
      updatedData,
    );
    return await this.getStaffMemberWithDeepDependencies(
      updatedStaffMember.id,
      10,
    );
  }
  async updateStaffMemberMany(arrObj: StaffMember[]) {
    return this.staffMemberRepository.save(arrObj);
  }
  async DelateById(id: number) {
    return this.staffMemberRepository.delete(id);
  }
}
