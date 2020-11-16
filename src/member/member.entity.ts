import { Subject } from 'src/subject/subject.entity';
import { Group } from 'src/group/group.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, ManyToOne, Unique } from 'typeorm';

@Entity()
@Unique(["memberCode"])
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  memberCode: string;

  @Column()
  name: string;

  @ManyToOne(type => Group, group => group.members, { nullable: true, onDelete: "CASCADE" })
  group: Group;

  @ManyToOne(type => Subject, subject => subject.members, { nullable: false, onDelete: "CASCADE" })
  subject: Subject;

  @Column()
  subjectId: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @CreateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}