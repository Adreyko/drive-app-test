import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  ValueTransformer,
} from 'typeorm';
import { Folder } from '../../folders/entities/folder.entity';
import { User } from '../../users/entities/user.entity';

const bigintTransformer: ValueTransformer = {
  to: (value: number) => value,
  from: (value: string | number) => Number(value),
};

@Entity({ name: 'files' })
@Unique(['s3Key'])
@Index(['ownerId'])
@Index(['ownerId', 'folderId'])
export class File {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 500 })
  s3Key!: string;

  @Column({
    type: 'bigint',
    transformer: bigintTransformer,
  })
  size!: number;

  @Column({ type: 'varchar', length: 255 })
  mimeType!: string;

  @Column({ type: 'uuid', nullable: true })
  folderId!: string | null;

  @ManyToOne(() => Folder, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'folderId' })
  folder!: Folder | null;

  @Column({ type: 'uuid' })
  ownerId!: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ownerId' })
  owner!: User;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
