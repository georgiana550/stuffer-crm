import * as bcrypt from 'bcryptjs';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Lead } from './lead.entity';
import { Notification } from './notification.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  dialing_code: string;

  @Column({ unique: true })
  phone_number: string;

  @Column()
  password: string;

  @Column({ default: false })
  email_verified: boolean;

  @Column({ nullable: true })
  verification_code: string;

  @Column({ nullable: true })
  is_active: boolean;

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification;

  @OneToMany(() => Lead, (lead) => lead.asignee)
  leads: Lead[];

  @Column({ default: 'user' })
  role: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  async hasPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  constructor(
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    role: string,
    is_active: boolean,
    leads?: Lead[],
    dialing_code?: string,
    phone_number?: string,
    email_verified?: boolean,
    verification_code?: string,
  ) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.role = role || 'user';
    this.leads = leads || null;
    this.dialing_code = dialing_code || null;
    this.phone_number = phone_number || null;
    this.email_verified = email_verified || false;
    this.verification_code = verification_code || null;
    this.password = password;
    this.is_active = is_active;
  }
}
