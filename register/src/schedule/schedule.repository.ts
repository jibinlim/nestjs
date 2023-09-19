import { Repository } from 'typeorm';
import { Schedule } from './entity/schedule.entity';
import { CustomRepository } from 'src/db/typeorm-ex.decorator';

@CustomRepository(Schedule)
export class ScheduleRepository extends Repository<Schedule> {}
