import { Test, TestingModule } from '@nestjs/testing';
import { CalculateService } from './calculate.service';
import { StaffMemberService } from 'modules/staff-member/staffMember.service';
import { StaffMember } from 'modules/staff-member/staffMember.entity';
function createStaffMember(
  id: number,
  name: string,
  type: string,
  baseSalary: number,
  joinDate: Date,
  supervisor: StaffMember,
  subordinates: StaffMember[],
) {
  const obj = new StaffMember();
  obj.baseSalary = baseSalary;
  obj.id = id;
  obj.joinDate = joinDate;
  obj.name = name;
  obj.subordinates = subordinates;
  obj.supervisor = supervisor;
  obj.type = type;
  return obj;
}
describe('CalculateService', () => {
  let calculateService: CalculateService;
  let staffMemberService: StaffMemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalculateService,
        {
          provide: StaffMemberService,
          useValue: {
            getAll: jest.fn(),
            getStaffMemberWithDeepDependencies: jest.fn(),
          },
        },
      ],
    }).compile();

    calculateService = module.get<CalculateService>(CalculateService);
    staffMemberService = module.get<StaffMemberService>(StaffMemberService);
  });

  it('[Employee] Test for the core work of Employee.', () => {
    const employee = createStaffMember(
      1,
      'Jon',
      'Employee',
      10000,
      new Date(2020, 1, 20),
      null,
      null,
    );

    const currentDate = new Date(2023, 1, 20); //3 Year

    const calculatedSalary = calculateService.calculateSalary(
      employee,
      currentDate,
    );
    const expectedSalary = 10900;
    expect(calculatedSalary).toEqual(expectedSalary);
  });
  it('[Manager] Test for the core work of Manager.', () => {
    const employee = createStaffMember(
      1,
      'Jon',
      'Manager',
      10000,
      new Date(2020, 1, 20),
      null,
      null,
    );

    const currentDate = new Date(2023, 1, 20); //3 Year

    const calculatedSalary = calculateService.calculateSalary(
      employee,
      currentDate,
    );
    const expectedSalary = 11500;
    expect(calculatedSalary).toEqual(expectedSalary);
  });
  it('[Sales] Test for the core work of Sales.', () => {
    const employee = createStaffMember(
      1,
      'Jon',
      'Sales',
      10000,
      new Date(2020, 1, 20),
      null,
      null,
    );

    const currentDate = new Date(2023, 1, 20); //3 Year

    const calculatedSalary = calculateService.calculateSalary(
      employee,
      currentDate,
    );
    const expectedSalary = 10300;
    expect(calculatedSalary).toEqual(expectedSalary);
  });
  it('[Employee] The test for an employee primary job if he or she mistakenly has subordinates.', () => {
    const employee = createStaffMember(
      1,
      'Jon',
      'Employee',
      10000,
      new Date(2020, 1, 20),
      null,
      [
        createStaffMember(
          2,
          'Jon',
          'Employee',
          10000,
          new Date(2020, 1, 20),
          null,
          null,
        ),
        createStaffMember(
          3,
          'Jon',
          'Employee',
          10000,
          new Date(2020, 1, 20),
          null,
          null,
        ),
      ],
    );

    const currentDate = new Date(2023, 1, 20); //3 Year

    const calculatedSalary = calculateService.calculateSalary(
      employee,
      currentDate,
    );
    const expectedSalary = 10900;
    expect(calculatedSalary).toEqual(expectedSalary);
  });
  it('[Manager] Calculating the salary of a manager with subordinates.', () => {
    const employee = createStaffMember(
      1,
      'Jon',
      'Manager',
      10000,
      new Date(2020, 1, 20),
      null,
      [
        createStaffMember(
          2,
          'Jon',
          'Employee',
          10000,
          new Date(2020, 1, 20),
          null,
          null,
        ),
        createStaffMember(
          3,
          'Jon',
          'Employee',
          10000,
          new Date(2020, 1, 20),
          null,
          null,
        ),
      ],
    );

    const currentDate = new Date(2023, 1, 20); //3 Year

    const calculatedSalary = calculateService.calculateSalary(
      employee,
      currentDate,
    );
    const expectedSalary = 11609;
    expect(calculatedSalary).toEqual(expectedSalary);
  });
  it('[Sales] Calculating the salary of a sales with subordinates.', () => {
    const employee = createStaffMember(
      1,
      'Jon',
      'Sales',
      10000,
      new Date(2020, 1, 20),
      null,
      [
        createStaffMember(
          2,
          'Jon',
          'Employee',
          10000,
          new Date(2020, 1, 20),
          null,
          null,
        ),
        createStaffMember(
          3,
          'Jon',
          'Employee',
          10000,
          new Date(2020, 1, 20),
          null,
          null,
        ),
      ],
    );

    const currentDate = new Date(2023, 1, 20); //3 Year

    const calculatedSalary = calculateService.calculateSalary(
      employee,
      currentDate,
    );
    const expectedSalary = 10300 + 65.4;
    expect(calculatedSalary).toEqual(expectedSalary);
  });

  //Глубокая вложеность.
  it('[Manager] Calculation of the manager of a salesman with a globally invested subordinates.', () => {
    //Менеджер обрезает зависмость глубже 1 уровня - так что подчененніе 2 и 3 Sales не должны учитываться в ращетах.
    const employee = createStaffMember(
      1,
      'Jon',
      'Manager',
      10000,
      new Date(2020, 1, 20),
      null,
      [
        createStaffMember(
          2,
          'Jon',
          'Sales',
          10000,
          new Date(2020, 1, 20),
          null,
          [
            createStaffMember(
              2,
              'Jon',
              'Sales',
              10000,
              new Date(2020, 1, 20),
              null,
              [],
            ),
            createStaffMember(
              3,
              'Jon',
              'Sales',
              10000,
              new Date(2020, 1, 20),
              null,
              [],
            ),
          ],
        ),
        createStaffMember(
          3,
          'Jon',
          'Sales',
          10000,
          new Date(2020, 1, 20),
          null,
          [
            createStaffMember(
              2,
              'Jon',
              'Sales',
              10000,
              new Date(2020, 1, 20),
              null,
              [],
            ),
            createStaffMember(
              3,
              'Jon',
              'Sales',
              10000,
              new Date(2020, 1, 20),
              null,
              [],
            ),
          ],
        ),
      ],
    );

    const currentDate = new Date(2023, 1, 20); //3 Year

    const calculatedSalary = calculateService.calculateSalary(
      employee,
      currentDate,
    );
    const BonusForTheYear = 11500;
    const BonusSubordinates = 20600; //сумма зп подчененых учитывая все их бонусы по логике.
    const CoefficientBonusSubordinates = 0.005;
    const expectedSalary =
      BonusForTheYear + BonusSubordinates * CoefficientBonusSubordinates;
    expect(calculatedSalary).toEqual(expectedSalary);
  });
  it('[Sales] Calculation of the salary of a salesman with a globally invested subordinates.', () => {
    const employee = createStaffMember(
      1,
      'Jon',
      'Sales',
      10000,
      new Date(2020, 1, 20),
      null,
      [
        createStaffMember(
          2,
          'Jon',
          'Sales',
          10000,
          new Date(2020, 1, 20),
          null,
          [
            createStaffMember(
              3,
              'Jon',
              'Manager',
              10000,
              new Date(2020, 1, 20),
              null,
              [
                createStaffMember(
                  3,
                  'Jon',
                  'Employee',
                  10000,
                  new Date(2020, 1, 20),
                  null,
                  null,
                ),
                createStaffMember(
                  3,
                  'Jon',
                  'Employee',
                  10000,
                  new Date(2020, 1, 20),
                  null,
                  null,
                ),
                createStaffMember(
                  3,
                  'Jon',
                  'Employee',
                  10000,
                  new Date(2020, 1, 20),
                  null,
                  null,
                ),
              ],
            ),
          ],
        ),
        createStaffMember(
          3,
          'Jon',
          'Manager',
          10000,
          new Date(2020, 1, 20),
          null,
          null,
        ),
        createStaffMember(
          4,
          'Jon',
          'Sales',
          10000,
          new Date(2020, 1, 20),
          null,
          [
            createStaffMember(
              4,
              'Jon',
              'Sales',
              10000,
              new Date(2020, 1, 20),
              null,
              [
                createStaffMember(
                  3,
                  'Jon',
                  'Employee',
                  10000,
                  new Date(2020, 1, 20),
                  null,
                  null,
                ),
                createStaffMember(
                  3,
                  'Jon',
                  'Employee',
                  10000,
                  new Date(2020, 1, 20),
                  null,
                  null,
                ),
                createStaffMember(
                  3,
                  'Jon',
                  'Manager',
                  10000,
                  new Date(2020, 1, 20),
                  null,
                  [
                    createStaffMember(
                      3,
                      'Jon',
                      'Sales',
                      10000,
                      new Date(2020, 1, 20),
                      null,
                      [
                        createStaffMember(
                          3,
                          'Jon',
                          'Employee',
                          10000,
                          new Date(2020, 1, 20),
                          null,
                          null,
                        ),
                        createStaffMember(
                          3,
                          'Jon',
                          'Employee',
                          10000,
                          new Date(2020, 1, 20),
                          null,
                          null,
                        ),
                        createStaffMember(
                          3,
                          'Jon',
                          'Employee',
                          10000,
                          new Date(2020, 1, 20),
                          null,
                          null,
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ],
    );

    const currentDate = new Date(2021, 1, 20); //1 Year

    const calculatedSalary = calculateService.calculateSalary(
      employee,
      currentDate,
    );

    //Схема зависимостей предоставлена в документации в разделе схемы зависимостей для тестов.
    //Формула.
    //Расчетз годового бонуса 1 указывает на количество лет.
    const Formuls = {
      Employee: 10000 + 10000 * (0.03 * 1),
      Manager: 10000 + 10000 * (0.05 * 1),
      Sales: 10000 + 10000 * (0.01 * 1),
    };

    const SalaryAmountInDepthLevel_5 = Formuls.Employee * 3; //Не учитываеться так как выше находиться Manager который обрезает влияние на зарплату верхних уровней.
    const SalaryAmountInDepthLevel_4 = Formuls.Sales; //
    const SalaryAmountInDepthLevel_3_1 =
      Formuls.Employee * 2 +
      Formuls.Manager +
      SalaryAmountInDepthLevel_4 * 0.005;
    const SalaryAmountInDepthLevel_2_1 =
      Formuls.Sales + SalaryAmountInDepthLevel_3_1 * 0.003;

    const SalaryAmountInDepthLevel_3_2 = Formuls.Employee * 3;
    const SalaryAmountInDepthLevel_2_2 =
      Formuls.Manager + SalaryAmountInDepthLevel_3_2 * 0.005;

    const SalaryAmountInDepthLevel_1 =
      Formuls.Sales +
      SalaryAmountInDepthLevel_2_1 * 0.003 +
      Formuls.Manager +
      Formuls.Sales +
      SalaryAmountInDepthLevel_2_2 * 0.003;
    //10192.2876.....
    const expectedSalary = Formuls.Sales + SalaryAmountInDepthLevel_1 * 0.003;
    expect(calculatedSalary).toEqual(expectedSalary);
  });
  it('[Calculate All Salary] Check the payroll of all employees.', async () => {
    //Менеджер обрезает зависмость глубже 1 уровня - так что подчененніе 2 и 3 Sales не должны учитываться в ращетах.
    const employee = createStaffMember(
      1,
      'Jon',
      'Sales',
      10000,
      new Date(2020, 1, 20),
      null,
      [
        createStaffMember(
          12,
          'Jon',
          'Sales',
          10000,
          new Date(2020, 1, 20),
          null,
          [
            createStaffMember(
              13,
              'Jon',
              'Manager',
              10000,
              new Date(2020, 1, 20),
              null,
              [
                createStaffMember(
                  14,
                  'Jon',
                  'Employee',
                  10000,
                  new Date(2020, 1, 20),
                  null,
                  null,
                ),
                createStaffMember(
                  15,
                  'Jon',
                  'Employee',
                  10000,
                  new Date(2020, 1, 20),
                  null,
                  null,
                ),
                createStaffMember(
                  16,
                  'Jon',
                  'Employee',
                  10000,
                  new Date(2020, 1, 20),
                  null,
                  null,
                ),
              ],
            ),
          ],
        ),
        createStaffMember(
          2,
          'Jon',
          'Manager',
          10000,
          new Date(2020, 1, 20),
          null,
          null,
        ),
        createStaffMember(
          3,
          'Jon',
          'Sales',
          10000,
          new Date(2020, 1, 20),
          null,
          [
            createStaffMember(
              4,
              'Jon',
              'Sales',
              10000,
              new Date(2020, 1, 20),
              null,
              [
                createStaffMember(
                  5,
                  'Jon',
                  'Employee',
                  10000,
                  new Date(2020, 1, 20),
                  null,
                  null,
                ),
                createStaffMember(
                  6,
                  'Jon',
                  'Employee',
                  10000,
                  new Date(2020, 1, 20),
                  null,
                  null,
                ),
                createStaffMember(
                  7,
                  'Jon',
                  'Manager',
                  10000,
                  new Date(2020, 1, 20),
                  null,
                  [
                    createStaffMember(
                      8,
                      'Jon',
                      'Sales',
                      10000,
                      new Date(2020, 1, 20),
                      null,
                      [
                        createStaffMember(
                          9,
                          'Jon',
                          'Employee',
                          10000,
                          new Date(2020, 1, 20),
                          null,
                          null,
                        ),
                        createStaffMember(
                          10,
                          'Jon',
                          'Employee',
                          10000,
                          new Date(2020, 1, 20),
                          null,
                          null,
                        ),
                        createStaffMember(
                          11,
                          'Jon',
                          'Employee',
                          10000,
                          new Date(2020, 1, 20),
                          null,
                          null,
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ],
    );
    const currentDate = new Date(2021, 1, 20); //1 Year
    const mockStaffMembers: StaffMember[] =
      SplittingIntoOwnDependencies(employee).reverse();

    (staffMemberService.getAll as jest.Mock).mockImplementation(() => {
      return mockStaffMembers;
    });

    (
      staffMemberService.getStaffMemberWithDeepDependencies as jest.Mock
    ).mockImplementation((id: number, depth: number) => {
      const em = mockStaffMembers.find((employee) => employee.id === id);
      return em;
    });

    const calculatedSalary = await calculateService.CalculateAllSalaryEmployee(
      currentDate,
    );

    const expectedSalary = 164945.9829860635;
    expect(calculatedSalary).toEqual(expectedSalary);

    function SplittingIntoOwnDependencies(
      employee: StaffMember,
    ): StaffMember[] {
      const ListObj = [];
      ListObj.push(employee);
      if (employee.subordinates) {
        for (const subordinate of employee.subordinates) {
          ListObj.push(...SplittingIntoOwnDependencies(subordinate));
        }
      }
      return ListObj;
    }
  });
});
