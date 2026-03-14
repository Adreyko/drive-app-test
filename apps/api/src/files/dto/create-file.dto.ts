import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { FileVisibility } from '../enums/file-visibility.enum';

export class CreateFileDto {
  @Transform(({ value }) => trimString(value))
  @IsString()
  @MaxLength(255)
  name!: string;

  @Transform(({ value }) => trimString(value))
  @IsString()
  @MaxLength(500)
  s3Key!: string;

  @Transform(({ value }) => trimString(value))
  @IsString()
  @MaxLength(255)
  mimeType!: string;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(0)
  size!: number;

  @IsOptional()
  @IsEnum(FileVisibility)
  visibility?: FileVisibility;

  @IsOptional()
  @IsUUID('4')
  folderId?: string | null;
}

function trimString(value: unknown): unknown {
  return typeof value === 'string' ? value.trim() : value;
}
