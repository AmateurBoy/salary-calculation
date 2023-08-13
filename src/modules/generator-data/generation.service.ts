import { StaffMember } from 'modules/staff-member/staffMember.entity';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class GenerationService {
  public staffMembers: StaffMember[] = [];

  public isReadJsonFileTheSuccess(path: string) {
    try {
      const jsonString = fs.readFileSync(path, 'utf8');
      this.staffMembers = JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  }
  async dependencyGeneration(data: StaffMember[]) {
    const staffMembers = data;
    //Перемешиваем.
    const shuffledMembers = this.shuffleArray(staffMembers);
    //Бежим по перемешеному масиву.
    /*Условия и логика
      1.Employee - не может иметь подчененых.
      2.Тот кого я присваеваю в свое подченение не являеться ли у него в подченеии 
      мой начальник.(Необходимпо пробежаться по всей вложености зависимостей начальников) 
      3.Колисество подчененых у одного роботника выбераеться рандомно в диапазоне. от 1-5.

    */
    for (const member of shuffledMembers) {
      if (member.type !== 'Employee') {
        //Количество генерируемых роботников в подченение.
        const countMember = this.getRandomInt(1, 5);
        //Реализация доавления в подченение.
        for (let i = 0; i < countMember; i++) {
          const freeWorker = this.getFreeEmployee(shuffledMembers);
          const IsNotNullObject = freeWorker ? true : false;
          if (!IsNotNullObject) {
            continue;
          }
          console.log(`${member.id} => ${member}`);
          const IsCorrectMerge = this.isHiringSafe(member, freeWorker);

          let isNotDublicat = false;
          if (IsNotNullObject) {
            isNotDublicat = freeWorker.id != member.id;
          }
          if (IsCorrectMerge && IsNotNullObject && isNotDublicat) {
            //Слияние свободного роботника с начальником.
            member.subordinates = member.subordinates ?? [];
            //Создание чистого обекта и заполнения его id - избегание JSON цикличности.
            const memberDTO = new StaffMember();
            memberDTO.id = member.id;
            freeWorker.supervisor = memberDTO;
            //Создание чистого обекта и заполнения его id - избегание JSON цикличности.
            const freeDTO = new StaffMember();
            freeDTO.id = freeWorker.id;
            member.subordinates.push(freeDTO);
          }
        }
      }
    }
    return shuffledMembers;
  }
  private getFreeEmployee(arrMember: StaffMember[]) {
    const resultArr = arrMember.filter(
      (member) => member.supervisor === null || member.supervisor === undefined,
    );
    return resultArr[this.getRandomInt(0, resultArr.length)];
  }

  private isHiringSafe(employee: StaffMember, newHire: StaffMember): boolean {
    const visited = new Set<number>();

    function checkSupervisors(emp: StaffMember): boolean {
      console.log(`${emp.name}|${emp.id}`);
      if (emp) {
        if (visited.has(emp.id)) {
          return false; // Циклическая зависимость
        }

        visited.add(emp.id);

        if (emp.supervisor) {
          if (emp.supervisor.id === newHire.id) {
            return false; // Новый найм не может быть начальником текущего сотрудника
          }
          return checkSupervisors(emp.supervisor);
        }

        return true;
      }
      return true;
    }

    return checkSupervisors(employee);
  }

  /*
  private checkForCyclicDependency(
    thisEmployee: StaffMember,
    employee: StaffMember,
    visited: Set<number> = new Set(),
  ): boolean {
    if (thisEmployee && employee) {
      if (thisEmployee.id === employee.id) {
        return true; // Циклическая зависимость найдена
      }

      if (visited.has(thisEmployee.id)) {
        return false; // Уже посетили этого сотрудника, нет циклической зависимости
      }

      visited.add(thisEmployee.id);

      if (thisEmployee.subordinates) {
        for (const subordinate of thisEmployee.subordinates) {
          if (this.checkForCyclicDependency(subordinate, employee, visited)) {
            return true;
          }
        }
      }
    }

    return false;
  }
  /*
  private checkforCyclicDependency(
    thisEmployee: StaffMember,
    employee: StaffMember,
  ): boolean {
    if (thisEmployee) {
      if (!thisEmployee.supervisor) {
        return false;
      }
      return thisEmployee.supervisor.id === employee.id
        ? true
        : this.checkforCyclicDependency(thisEmployee.supervisor, employee);
    }
    return true;
  }
*/
  private shuffleArray(array: any[]): StaffMember[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  public getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
