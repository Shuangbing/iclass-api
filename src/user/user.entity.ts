import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Unique, BeforeInsert, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Subject } from '../subject/subject.entity';
import bcrypt = require('bcrypt');

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: false })
  isActive: boolean;

  @OneToMany(type => Subject, subject => subject.user)
  subjects: Subject[];

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }
}