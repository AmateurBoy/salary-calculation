## :shipit: Purpose of the application 
The aim of the project is to calculate the wages of workers with certain conditions 
such as: 
- Type of employee
- Number of employees
  
There are three types of staff members: Employee, Manager, and Sales. Any staff member can have a supervisor. Likewise, any staff member except for Employee can have subordinates.
* Employee salary - base salary plus 3% for each year they have worked with the company, but not more than 30% of the base salary.

* Manager salary - base salary plus 5% for each year they have worked with the company (but not more than 40% of the base salary), plus 0.5% of the salaries of their first-level subordinates.

* Sales salary - base salary plus 1% for each year they have worked with the company (but not more than 35% of the base salary) plus 0.3% of the salaries of their subordinates of any level.

---
![CoefficientFormulType](https://github.com/AmateurBoy/salary--alculation/assets/90874301/774a54f0-e7e2-4eec-985a-65611bbf478e)

 Staff members (except Employees) can have any number of subordinates.

## Project structure
```bash
src
|-- modules
|   |-- staff-member => (Working with an entity)
|   |   |-- staff-member.entity.ts 
|   |   |-- staff-member.controller.ts
|   |   |-- staff-member.service.ts
|   |   |-- staff-member.module.ts
|   |-- generator-data => (Genration Data Logic (Optional))
|   |   |-- generation.controller.ts
|   |   |-- generation.service.ts
|   |   |-- generation.module.ts
|   |-- calculator => (Core Logic)
|   |  	|-- calculation.controller.ts
|   |   |-- calculation.service.ts
|   |   |-- calculation.module.ts
|   |	|-- calculate.service.spec.ts => (Unit test core logic)
|-- app.module.ts
|-- main.ts
```

## Endpoints
### Core Endpoints (Calculate)

#### Calculate by ID
- **HTTP Method:** GET
- **Query:** `/calculate/id/:id`
- **Example:**
  - **Query:** `http://localhost:3000/calculate/id/1`
  - **Response:** `10100`
---
#### Calculate Full
- **HTTP Method:** GET
- **Query:** `/calculate/full`
- **Example:**
  - **Query:** `http://localhost:3000/calculate/full`  
  - **Response:** `10000100` 
---
## Algorithm description
I decided to realize this task through 
Depth-first search algorithm based on (Depth-first search) taking into account the logic of object types.
Here's a small example of the calculation.
First, we take as a constant for simplicity of manual calculations that all objects have 1 year of work experience and all objects have salary 10000 visually it looks like this:
---
<div style="overflow: hidden; width: 100px; height: 100px;">
  <img src="https://github.com/AmateurBoy/salary--alculation/assets/90874301/2b6876f4-9fc1-434f-b529-eee14f9c134f" width="38%" height="50%" alt="image">
  <img src="https://github.com/AmateurBoy/salary--alculation/assets/90874301/225887bc-9377-40ff-a999-006fa985dd3e" width="55%" height="50%" alt="image">
</div>


## Data
![image](https://github.com/AmateurBoy/salary--alculation/assets/90874301/b50fcc1d-13d8-49cd-9ba6-03b699697e16)

The data was generated using the service : [GENERATOR](https://generatedata.com/generator).
---
A service was implemented to work with itovgovymi files of this site to generate on the basis of the information provided data in the database.
SQLite and TypeORM were used to work with the database.
А test database is attached to the appendix.
The .env file was not added to .gitignor to make it easier to work with the data, if you need to replace the data, replace it there.

## Advantages and disadvantages :nerd_face:

Disadvantages:

Testing: The project lacks complete test coverage. Adding a broader set of tests will ensure that the application works correctly.

Security: In real projects attention should be paid to security aspects such as authentication, authorization and protection from external attacks (Spam) Adding a database in a real project is not allowed in the project repository .env file too but considering that this is a test project this approach will allow more extensive full control over the application.

Incompleteness: There are places that require improvements or even rework of the logic.

---

Benefits:

Code cleanliness: Correct and clear code layout, adding comments.

Modular approach: The standard Nest.js application archestructure was used to create the project, which makes it easier to maintain the application.

Scalability: the basic logic is built on the possibility of extending the functionality.

Popular algorithm: using a popular algorithm that can be learned about from outside the project.

---

Potential Improvements:
Query optimization: it is possible to optimize database queries

Logging: implementing a logging system helps to track errors and events in the application.

Scalability: Improve scalability or reconsider architectural decisions in favor of code scalability for further development of the project.

Error handling: Improving error handling and notification can make the application more stable and usable.

Documentation: creating more detailed documentation, including API descriptions and installation and launch instructions.

Abstractions: build more on abstractions to provide interfaces to the client so it will always be easier to extend functionality.

Security: Ensuring API security, Data validation, Authentication and Authorization and so on...

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Test

```bash
# unit tests
$ npm run test
```
