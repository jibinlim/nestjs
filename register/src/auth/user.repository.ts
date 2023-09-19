import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { CustomRepository } from 'src/db/typeorm-ex.decorator';

@CustomRepository(User)
export class UserRepository extends Repository<User> {}
