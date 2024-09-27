import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { User } from './user.entity';
import { LeadStatus } from './lead-status.entity';

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  fullName: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  phone: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column()
  createdById: number;

  @ManyToOne(() => User, (user) => user.leads)
  @JoinColumn({ name: 'asigneeId' })
  asignee: User;

  @Column({ nullable: true })
  asigneeId: number;

  @ManyToMany(() => Course, (course) => course.leads, { onDelete: 'CASCADE' })
  courses: Course[];

  @Column({ nullable: true })
  source: string;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  submittedDate: Date;

  @ManyToOne(() => LeadStatus, { eager: true }) 
  @JoinColumn({ name: 'statusId' })  
  status: LeadStatus; // This will hold the associated LeadStatus entity

  @Column()
  statusId: number;

  @Column({ nullable: true })
  refereeName?: string | null;

  @Column({ nullable: true })
  dateOfBirth?: Date | null;

  @Column({ nullable: true, default: 'English' })
  language?: string | null;

  @Column({ nullable: true })
  citizenship?: string | null;

  @Column('json', { nullable: true })
  additionalColumns?: Record<string, any> | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor(
    fullName: string,
    email: string,
    phone: string,
    courses: Course[],
    createdBy: User,
    status: LeadStatus,
    asignee?: User,
    refereeName?: string,
    dateOfBirth?: Date,
    language?: string,
    citizenship?: string,
    additionalColumns?: Record<string, any>,
    source?: string,
    submittedDate?: Date,
  ) {
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.courses = courses;
    this.createdBy = createdBy;
    this.status = status;
    this.asignee = asignee || null;
    this.source = source || null;
    this.refereeName = refereeName || null;
    this.dateOfBirth = dateOfBirth || null;
    this.language = language || null;
    this.citizenship = citizenship || null;
    this.additionalColumns = additionalColumns || null;
    this.submittedDate = submittedDate || new Date();
  }
}
