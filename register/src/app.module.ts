import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/entity/user.entity';
import { TypeOrmExModule } from './db/typeorm-ex.module';
import { UserRepository } from './auth/user.repository';
import { ScheduleModule } from './schedule/schedule.module';
import { Schedule } from './schedule/entity/schedule.entity';
import { ScheduleRepository } from './schedule/schedule.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'PLC',
      entities: [User, Schedule],
      autoLoadEntities: true,
      synchronize: false,
    }),
    TypeOrmExModule.forCustomRepository([UserRepository, ScheduleRepository]),
    AuthModule,
    ScheduleModule,
  ],
})
export class AppModule {}
