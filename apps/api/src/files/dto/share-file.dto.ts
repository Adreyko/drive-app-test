import { Transform } from 'class-transformer';
import { IsEmail, IsEnum } from 'class-validator';
import { FileAccessRole } from '../enums/file-access-role.enum';

export class ShareFileDto {
  @Transform(({ value }) => normalizeEmail(value))
  @IsEmail()
  email!: string;

  @IsEnum(FileAccessRole)
  role!: FileAccessRole;
}

function normalizeEmail(value: unknown): unknown {
  return typeof value === 'string' ? value.trim().toLowerCase() : value;
}
