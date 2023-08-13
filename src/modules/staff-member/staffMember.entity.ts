import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class StaffMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ type: 'date' })
  joinDate: Date;

  @Column()
  baseSalary: number;

  @ManyToOne(() => StaffMember, { nullable: true })
  supervisor: StaffMember;

  @ManyToMany(() => StaffMember, (subordinate) => subordinate.supervisor)
  @JoinTable({
    name: 'subordinate_relation',
    joinColumn: {
      name: 'subordinate_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'supervisor_id',
      referencedColumnName: 'id',
    },
  })
  subordinates: StaffMember[];
}
