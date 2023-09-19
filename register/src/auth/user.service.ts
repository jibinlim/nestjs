import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserDTO } from './dto/user.dto';
import { FindManyOptions, FindOneOptions } from 'typeorm';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  //등록이 된 유저인지 확인
  async findByFields(
    options: FindOneOptions<UserDTO>,
  ): Promise<UserDTO | undefined> {
    return await this.userRepository.findOne(options);
  }

  //신규 유저 등록
  async save(userDTO: UserDTO): Promise<UserDTO | undefined> {
    return await this.userRepository.save(userDTO);
  }

  async delete(userDTO: UserDTO): Promise<string | undefined> {
    await this.userRepository.softDelete({ id: userDTO.id });
    return 'delete complete';
  }

  async findAll(options: FindManyOptions): Promise<Object | undefined> {
    return await this.userRepository.find(options);
  }
}
