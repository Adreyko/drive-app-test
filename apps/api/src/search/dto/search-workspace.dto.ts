import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SearchWorkspaceDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;
}
