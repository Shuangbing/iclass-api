import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  title: string;

  @Column()
  description: string;

  @ManyToOne(type => User, user => user.projects)
  user: User;
  
}