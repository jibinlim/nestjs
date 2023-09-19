import { Injectable } from '@nestjs/common';
import {
  ScheduleFind,
  ScheduleInput,
  ScheduleUpdate,
  ScheduleDelete,
} from './dto/schedule.dto';
import { ScheduleRepository } from './schedule.repository';
import { UserService } from 'src/auth/user.service';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ScheduleService {
  constructor(
    private scheduleRepository: ScheduleRepository,
    private userService: UserService,
  ) {}

  async posting(scheduleInput: ScheduleInput): Promise<string> {
    const user = await this.userService.findByFields({
      where: { email: scheduleInput.email },
    });
    if (!user) {
      throw new HttpException(
        '해당 이메일을 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { title, description, category, date } = scheduleInput;
    const scheduleIN = {
      title: title,
      description: description,
      category: category,
      date: date,
      user: user,
    };
    await this.scheduleRepository.save(scheduleIN);
    return 'SUCCESS';
  }

  async finding(schedulefind: ScheduleFind): Promise<object> {
    let schedules = await this.scheduleRepository.find({
      relations: ['user'], // 'user'는 Schedule 엔티티의 user 필드명과 일치해야 합니다.
    });
    const schedulesMatch = schedules.filter((schedule) => {
      if (schedule.user && schedule.user.email === schedulefind.email)
        return schedule;
    });
    const match = schedulesMatch.filter((schedule) => {
      if (schedule.date && schedule.date === schedulefind.date) return schedule;
    });
    const dateArray = match.map((schedule) => {
      return {
        id: schedule.id,
        title: schedule.title,
        description: schedule.description,
        category: schedule.category,
      };
    });
    return dateArray;
  }

  async updateschdule(
    scheduleUpdate: ScheduleUpdate,
  ): Promise<string | undefined> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleUpdate.id },
    });
    if (!schedule)
      throw new HttpException(
        '해당 스케쥴을 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    schedule.title = scheduleUpdate.title;
    schedule.description = scheduleUpdate.description;
    schedule.category = scheduleUpdate.category;
    await this.scheduleRepository.save(schedule);
    return 'success';
  }

  async deleteschedule(
    scheduleDelete: ScheduleDelete,
  ): Promise<string | undefined> {
    const daily = await this.scheduleRepository.findOne({
      where: { id: scheduleDelete.id },
      relations: ['user'],
    });
    if (daily.user.email === scheduleDelete.email) {
      await this.scheduleRepository.delete({ id: scheduleDelete.id });
      return 'delete complete';
    } else
      throw new HttpException(
        '본인 스케쥴만 삭제 가능합니다.',
        HttpStatus.BAD_REQUEST,
      );
  }
}
