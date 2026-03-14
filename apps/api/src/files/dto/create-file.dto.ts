import { Transform } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

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
  @IsUUID('4')
  folderId?: string | null;
}

function trimString(value: unknown): unknown {
  return typeof value === 'string' ? value.trim() : value;
}
