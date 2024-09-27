import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Lead } from './lead.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  location: string;

  @ManyToMany(() => Lead, (lead) => lead.courses)
  @JoinTable({
    name: 'courses_leads',
    joinColumn: { name: 'courseId' },
    inverseJoinColumn: { name: 'leadId' },
  })
  leads: Lead[];

  @Column({ nullable: true })
  universityName: string | null;

  @Column({ nullable: true })
  startDate: Date | null;

  @Column({ nullable: true })
  endDate: Date | null;

  @Column({ nullable: true })
  additionalInformation: string | null;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  constructor(
    name: string,
    description: string,
    location: string,
    universityName?: string,
    startDate?: Date,
    endDate?: Date,
    additionalInformation?: string,
  ) {
    this.name = name;
    this.description = description;
    this.location = location;
    this.universityName = universityName || null;
    this.startDate = startDate || null;
    this.endDate = endDate || null;
    this.additionalInformation = additionalInformation;
  }
}
