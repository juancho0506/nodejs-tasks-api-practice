import { IsIn, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { TASK_STATUSES, TaskStatus } from '../task-status';

// Only the fields declared here can be changed. `id` and `createdAt` are
// intentionally absent so the whitelist strips them.
export class UpdateTaskDto {
  @ValidateIf((o, v) => v !== undefined)
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ValidateIf((o, v) => v !== undefined)
  @IsIn(TASK_STATUSES)
  status?: TaskStatus;

  @ValidateIf((o, v) => v !== undefined)
  @IsString()
  assignee?: string;
}
