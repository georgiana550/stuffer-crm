import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('settings')
export class Setting {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Index({ unique: true })
    name: string;

    @Column()
    value: string;

    constructor(name: string, value: string) {
        this.name = name;
        this.value = value;
    }
}
