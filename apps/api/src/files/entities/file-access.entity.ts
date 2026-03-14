import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { FileAccessRole } from '../enums/file-access-role.enum';
import { File } from './file.entity';

@Entity({ name: 'file_access' })
@Unique(['fileId', 'userId'])
@Index(['userId'])
@Index(['fileId'])
export class FileAccess {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  fileId!: string;

  @ManyToOne(() => File, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'fileId' })
  file!: File;

  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({
    type: 'enum',
    enum: FileAccessRole,
  })
  role!: FileAccessRole;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
