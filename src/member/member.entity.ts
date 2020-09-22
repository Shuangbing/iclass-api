import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';

@Entity()
export class Member {
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

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @CreateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}