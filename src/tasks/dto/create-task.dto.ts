import { IsIn, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { TASK_STATUSES, TaskStatus } from '../task-status';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @ValidateIf((o, v) => v !== undefined)
  @IsIn(TASK_STATUSES)
  status?: TaskStatus;

  @ValidateIf((o, v) => v !== undefined)
  @IsString()
  assignee?: string;
}
