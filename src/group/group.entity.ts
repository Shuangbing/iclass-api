
import { Subject } from 'src/subject/subject.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, CreateDateColumn } from 'typeorm';

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

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @CreateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}