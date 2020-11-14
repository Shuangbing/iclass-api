
import { Subject } from 'src/subject/subject.entity';
import { File } from 'src/file/file.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, CreateDateColumn, Unique } from 'typeorm';
import { Member } from 'src/member/member.entity';

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

  @OneToMany(type => File, file => file.group)
  files: File[];

  @OneToMany(type => Member, member => member.group, { nullable: false, onDelete: "CASCADE" })
  members: Member[];

  @Column()
  subjectId: number;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @CreateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}