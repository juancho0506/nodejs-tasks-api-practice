import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { PAGE_LIMITS } from '../tasks.constants';

export class ListTasksQueryDto {
  // Not validated against TASK_STATUSES on purpose: an unknown status is just a
  // filter with no matches (empty list). @IsString only keeps it past the whitelist.
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(PAGE_LIMITS.MIN)
  @Max(PAGE_LIMITS.MAX)
  limit?: number = PAGE_LIMITS.DEFAULT;
}
