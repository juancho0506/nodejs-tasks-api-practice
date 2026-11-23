import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

const STATUSES = ['todo', 'in_progress', 'done'];

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsIn(STATUSES)
  status?: 'todo' | 'in_progress' | 'done';

  @IsOptional()
  @IsString()
  assignee?: string;
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsIn(STATUSES)
  status?: 'todo' | 'in_progress' | 'done';

  @IsOptional()
  @IsString()
  assignee?: string;
}
