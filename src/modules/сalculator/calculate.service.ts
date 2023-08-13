import { StaffMember } from 'modules/staff-member/staffMember.entity';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { StaffMemberService } from 'modules/staff-member/staffMember.service';

interface EmployeeCoefficient {
  inOneYear: number;
  inMaxYear: number;
  BonusEmployee: number;
}

@Injectable()
export class CalculateService {
  constructor(
    @Inject(forwardRef(() => StaffMemberService))
    private staffMemberService: StaffMemberService,
  ) {}

  private readonly EmployeesTypes: Record<string, EmployeeCoefficient> = {
    Employee: { inOneYear: 0.03, inMaxYear: 0.3, BonusEmployee: 0 },
    Manager: { inOneYear: 0.05, inMaxYear: 0.4, BonusEmployee: 0.005 },
    Sales: { inOneYear: 0.01, inMaxYear: 0.3, BonusEmployee: 0.003 },
    // Добавьте другие типы и их коэффициенты увеличения
  };

  private calculateSeniorityBonus(
    employee: StaffMember,
    currentDate: Date,
  ): number {
    return (
      employee.baseSalary *
      Math.min(
        this.EmployeesTypes[employee.type].inOneYear *
          this.calculateYearsWorked(employee.joinDate, currentDate),
        this.EmployeesTypes[employee.type].inMaxYear,
      )
    );
  }
  private isCorrectType(type: string) {
    if (!(type in this.EmployeesTypes)) {
      return false;
    } else {
      return true;
    }
  }

  public calculateSalary(employee: StaffMember, currentDate: Date) {
    if (!this.isCorrectType(employee.type)) {
      return 0;
    }

    if (employee.type === 'Manager') {
      this.cutDependencies(employee, 0);
    }

    const SeniorityBonus = this.calculateSeniorityBonus(employee, currentDate);
    const subordinateSalaries = this.DeepCalculation(employee, currentDate);
    const subordinateBonus =
      subordinateSalaries * this.EmployeesTypes[employee.type].BonusEmployee;

    return employee.baseSalary + SeniorityBonus + subordinateBonus;
  }
  //Метод подсчета количестав проработыных лет.
  public calculateYearsWorked(joinDateObj: Date, currentDate: Date): number {
    let joinDate = new Date();
    try {
      joinDate = parseCustomDate(joinDateObj);
    } catch {
      joinDate = joinDateObj;
    }
    const yearsDiff = currentDate.getFullYear() - joinDate.getFullYear();
    if (
      currentDate.getMonth() < joinDate.getMonth() ||
      (currentDate.getMonth() === joinDate.getMonth() &&
        currentDate.getDate() < joinDate.getDate())
    ) {
      return yearsDiff - 1;
    }
    return yearsDiff;
    function parseCustomDate(dateString) {
      const parts = dateString.split('-');
      if (parts.length !== 3) {
        throw new Error('Invalid date format');
      }

      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1;
      const day = parseInt(parts[2]);

      return new Date(year, month, day);
    }
  }
  private DeepCalculation(employee: StaffMember, currentDate: Date) {
    let subordinateSalaries = 0;
    if (employee.subordinates !== null && employee.subordinates !== undefined) {
      subordinateSalaries = employee.subordinates.reduce(
        (sum, subordinate) =>
          sum + this.calculateSalary(subordinate, currentDate),
        0,
      );
    }
    return subordinateSalaries;
  }
  //Метод для обрезки зависимостей у менеджера
  public cutDependencies(employee: StaffMember, lvlCup: number) {
    if (employee.subordinates && lvlCup >= 0) {
      for (const empl of employee.subordinates) {
        if (lvlCup === 0) {
          empl.subordinates = null;
        } else {
          this.cutDependencies(empl, lvlCup - 1);
        }
      }
    }

    return employee;
  }
  public async CalculateAllSalaryEmployee(currentDate: Date) {
    //получить всех роботников без вложености.
    const AllMember = await this.staffMemberService.getAll();
    let resultSum = 0;
    for (const member of AllMember) {
      const memberDependencie =
        await this.staffMemberService.getStaffMemberWithDeepDependencies(
          member.id,
          10,
        );
      const resultMember = this.calculateSalary(memberDependencie, currentDate);
      resultSum += resultMember;
    }
    return resultSum;
  }
}
