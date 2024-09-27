import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sources')
export class Source {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
