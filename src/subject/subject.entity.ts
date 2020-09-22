import { Group } from 'src/group/group.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, Unique, ManyToMany } from 'typeorm';

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

  @Column({ nullable: true })
  userId: string;

  @OneToMany(type => Group, group => group.subject)
  groups: Group[];
}