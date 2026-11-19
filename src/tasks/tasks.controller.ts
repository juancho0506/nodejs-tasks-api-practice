import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Post()
  create(@Body() body: any) {
    return this.tasks.create(body);
  }

  @Get()
  findAll(@Query('status') status?: string, @Query('limit') limit?: string) {
    return this.tasks.findAll(status, limit);
  }

  @Get('stats/by-assignee')
  statsByAssignee() {
    return this.tasks.statsByAssignee();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasks.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.tasks.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.tasks.remove(id);
    return { deleted: true };
  }
}
