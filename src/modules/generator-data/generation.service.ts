import { StaffMember } from 'modules/staff-member/staffMember.entity';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class GenerationService {
  public staffMembers: StaffMember[] = [];
  //Get the path to the file and check for JSON data in it, if the file
  //is available for reading it writes the data to the staffMembers variable and returns true
  public isReadJsonFileTheSuccess(path: string) {
    try {
      const jsonString = fs.readFileSync(path, 'utf8');
      this.staffMembers = JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  }
  //A randomized robot linkage generator. Requires additional checks for consistency.
  async dependencyGeneration(data: StaffMember[]) {
    const staffMembers = data;
    //Stir.
    const shuffledMembers = this.shuffleArray(staffMembers);
    //Run through the jumbled array.
    /*Conditions and logic
      1.Employee - cannot have subordinates.
      2.The one I assign to my subordinate is not my boss. 
      my supervisor. (It is necessary to run through the whole nesting of dependencies of supervisors). 
      3.The number of subordinates of one robot is chosen randomly in the range from 1-5.
    */
    for (const member of shuffledMembers) {
      if (member.type !== 'Employee') {
        //Number of robots generated per subordinate.
        const countMember = this.getRandomInt(1, 5);
        //Realization of doation to subordination.
        for (let i = 0; i < countMember; i++) {
          const freeWorker = this.getFreeEmployee(shuffledMembers);
          const IsNotNullObject = freeWorker ? true : false;
          if (!IsNotNullObject) {
            continue;
          }
          const IsCorrectMerge = this.isHiringSafe(member, freeWorker);

          let isNotDublicat = false;
          if (IsNotNullObject) {
            isNotDublicat = freeWorker.id != member.id;
          }
          if (IsCorrectMerge && IsNotNullObject && isNotDublicat) {
            //The merger of the free laborer with the boss.
            member.subordinates = member.subordinates ?? [];
            //Creating a clean object and filling it with id - avoiding JSON looping.
            const memberDTO = new StaffMember();
            memberDTO.id = member.id;
            freeWorker.supervisor = memberDTO;
            //Creating a clean object and filling it with id - avoiding JSON looping.
            const freeDTO = new StaffMember();
            freeDTO.id = freeWorker.id;
            member.subordinates.push(freeDTO);
          }
        }
      }
    }
    return shuffledMembers;
  }
  //Returns a free worker
  private getFreeEmployee(arrMember: StaffMember[]) {
    const resultArr = arrMember.filter(
      (member) => member.supervisor === null || member.supervisor === undefined,
    );
    return resultArr[this.getRandomInt(0, resultArr.length)];
  }
  //It's now method for testing for looping.
  private isHiringSafe(employee: StaffMember, newHire: StaffMember): boolean {
    const visited = new Set<number>();

    function checkSupervisors(emp: StaffMember): boolean {
      if (emp) {
        if (visited.has(emp.id)) {
          return false; // Cyclic dependence
        }

        visited.add(emp.id);

        if (emp.supervisor) {
          if (emp.supervisor.id === newHire.id) {
            return false; // A new hire cannot be the current employee's supervisor
          }
          return checkSupervisors(emp.supervisor);
        }

        return true;
      }
      return true;
    }

    return checkSupervisors(employee);
  }
  //It's an old method for testing for looping.
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
  //array mixing
  private shuffleArray(array: any[]): StaffMember[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  //Getting a random number in a range.
  public getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
