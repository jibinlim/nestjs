import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { ScheduleRepository } from './schedule.repository';
import { TypeOrmExModule } from 'src/db/typeorm-ex.module';
import { UserService } from 'src/auth/user.service';
import { UserRepository } from 'src/auth/user.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UserRepository, ScheduleRepository]),
  ],
  providers: [ScheduleService, UserService],
  controllers: [ScheduleController],
  exports: [ScheduleService],
})
export class ScheduleModule {}
