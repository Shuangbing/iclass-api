
import { Subject } from 'src/subject/subject.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, CreateDateColumn, Unique } from 'typeorm';

@Entity()
@Unique(["groupCode"])
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  groupCode: string;

  @Column()
  title: string;

  @ManyToOne(type => Subject, subject => subject.groups)
  subject: Subject;

  @Column()
  subjectId: number;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @CreateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}