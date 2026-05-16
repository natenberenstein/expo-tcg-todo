import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateScanDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageUri?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  notes?: string;
}
