import { Controller, Delete, Get, Query } from '@nestjs/common';
import {
  ScheduleFind,
  ScheduleInput,
  ScheduleUpdate,
  ScheduleDelete,
} from './dto/schedule.dto';
import { Post, Patch } from '@nestjs/common';
import { Req, Body } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Request } from '@nestjs/common';

@Controller('schedule')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}
  @Post('/posting')
  async scheduleposting(
    @Req() req: Request,
    @Body() scheduleInput: ScheduleInput,
  ): Promise<string> {
    // console.log(scheduleInput);
    return await this.scheduleService.posting(scheduleInput);
  }

  @Get('/getmyschedule')
  async scheduleget(
    @Req() req: Request,
    @Query() schedulefind: ScheduleFind,
  ): Promise<object> {
    return await this.scheduleService.finding(schedulefind);
  }

  @Patch('/updateschedule')
  async scheduleupdate(
    @Req() req: Request,
    @Body() scheduleUpdate: ScheduleUpdate,
  ): Promise<string | undefined> {
    return await this.scheduleService.updateschdule(scheduleUpdate);
  }

  @Delete('/deleteschedule')
  async deleteschedule(
    @Req() req: Request,
    @Body() scheduleDelete: ScheduleDelete,
  ): Promise<string | undefined> {
    return await this.scheduleService.deleteschedule(scheduleDelete);
  }
}
