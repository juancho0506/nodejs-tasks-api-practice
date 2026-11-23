import {
  BadRequestException, Body, Controller, Delete, Get, HttpCode,
  Param, ParseIntPipe, Patch, Post, Query,
} from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Post()
  create(@Body() body: CreateTaskDto) {
    return this.tasks.create(body);
  }

  @Get()
  findAll(@Query('status') status?: string, @Query('limit') limit?: string) {
    let max = 50;
    if (limit !== undefined) {
      max = Number(limit);
      if (!Number.isInteger(max) || max < 1 || max > 100) {
        throw new BadRequestException('limit must be an integer between 1 and 100');
      }
    }
    return this.tasks.findAll(status, max);
  }

  @Get('stats/by-assignee')
  statsByAssignee() {
    return this.tasks.statsByAssignee();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasks.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateTaskDto) {
    return this.tasks.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    this.tasks.remove(id);
  }
}
