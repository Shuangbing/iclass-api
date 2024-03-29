import { Group } from 'src/group/group.entity';
import { Member } from 'src/member/member.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, Unique, ManyToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
@Unique(["code"])
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  password: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: true })
  permitPreGroup: boolean;

  @ManyToOne(type => User, user => user.subjects)
  user: User;

  @Column()
  userId: number;

  @OneToMany(type => Group, group => group.subject)
  groups: Group[];

  @OneToMany(type => Member, member => member.subject)
  members: Member[];

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}