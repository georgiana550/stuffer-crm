import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('lead_status')
export class LeadStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  code: string;

  constructor(name: string, code: string) {
    this.name = name;
    this.code = code;
  }
}
