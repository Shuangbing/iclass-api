
import { Group } from 'src/group/group.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  location: string;

  @Column()
  size: number;

  @ManyToOne(type => Group, group => group.files)
  group: Group;

  @Column()
  memberId: string;

  @Column()
  memberName: string;

  @Column()
  groupId: number;

  @Column()
  expiredAt: Date;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @CreateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}