import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Subject } from '../subject/subject.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: false })
  isActive: boolean;

  @OneToMany(type => Subject, subject => subject.user)
  subjects: Subject[];
}