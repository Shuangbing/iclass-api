
import { Subject } from 'src/subject/subject.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  number: string;

  @Column()
  title: string;

  @ManyToOne(type => Subject, subject => subject.groups)
  subject: Subject;
}