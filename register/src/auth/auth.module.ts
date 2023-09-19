import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmExModule } from 'src/db/typeorm-ex.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UserRepository]),
    JwtModule.register({
      secret: '3hap',
      signOptions: { expiresIn: '1800s' },
    }),
  ],
  exports: [TypeOrmExModule],
  providers: [AuthService, UserService],
  controllers: [AuthController],
})
export class AuthModule {}
