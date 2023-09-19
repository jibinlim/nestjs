import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO, Change, Validation, Newtoken } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async changePassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async transformPassword(user: UserDTO): Promise<void> {
    user.password = await bcrypt.hash(user.password, 10);
    return Promise.resolve();
  }
  async registerUser(newUser: UserDTO): Promise<UserDTO> {
    let userFind: UserDTO = await this.userService.findByFields({
      where: { email: newUser.email },
    });
    if (userFind) {
      throw new HttpException(
        '이미 존재하는 이메일입니다',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.transformPassword(newUser);
    return await this.userService.save(newUser);
  }

  async validateUser(
    newUser: UserDTO,
  ): Promise<{ accessToken: string; email: string; name: string } | undefined> {
    let userFind: UserDTO = await this.userService.findByFields({
      where: { email: newUser.email },
    });
    if (!userFind) {
      throw new HttpException('이메일을 확인해주세요', HttpStatus.BAD_REQUEST);
    }
    const validatePassword = await bcrypt.compare(
      newUser.password,
      userFind.password,
    );
    if (!validatePassword) {
      throw new UnauthorizedException('비밀번호를 확인해주세요');
    }
    const payload = { email: userFind.email, name: userFind.name };
    let accessToken = this.jwtService.sign(payload);

    return {
      accessToken: accessToken,
      email: userFind.email,
      name: userFind.name,
    };
  }

  async change(change: Change): Promise<string> {
    let userFind: UserDTO = await this.userService.findByFields({
      where: { email: change.currentemail },
    });
    if (!userFind) {
      throw new HttpException('이메일을 확인해주세요', HttpStatus.BAD_REQUEST);
    }
    const validatePassword = await bcrypt.compare(
      change.currentpsw,
      userFind.password,
    );
    if (!validatePassword) {
      throw new UnauthorizedException('비밀번호를 확인해주세요');
    }
    userFind.password = await this.changePassword(change.cngpsw);
    if (userFind.email !== change.cngemail) {
      let user: UserDTO = await this.userService.findByFields({
        where: { email: change.cngemail },
      });
      if (user)
        throw new HttpException(
          '이미 존재하는 이메일입니다',
          HttpStatus.BAD_REQUEST,
        );
      userFind.email = change.cngemail;
    }
    await this.userService.save(userFind);
    return 'Success';
  }

  // async changeEmail(changeEmail: ChangeEmail): Promise<string> {
  //   let userFind: UserDTO = await this.userService.findByFields({
  //     where: { email: changeEmail.nowemail },
  //   });
  //   if (!userFind) {
  //     throw new HttpException('no user', HttpStatus.BAD_REQUEST);
  //   }
  //   const validatePassword = await bcrypt.compare(
  //     changeEmail.password,
  //     userFind.password,
  //   );
  //   if (!validatePassword) {
  //     throw new UnauthorizedException();
  //   }
  //   let user: UserDTO = await this.userService.findByFields({
  //     where: { email: changeEmail.changeemail },
  //   });
  //   if (user) {
  //     throw new HttpException('user already used!', HttpStatus.BAD_REQUEST);
  //   }
  //   userFind.email = changeEmail.changeemail;
  //   await this.userService.save(userFind);
  //   return 'Success';
  // }

  async deleteUser(newUser: UserDTO): Promise<string> {
    let userFind: UserDTO = await this.userService.findByFields({
      where: { email: newUser.email },
    });
    if (!userFind) {
      throw new HttpException('이메일을 확인해주세요', HttpStatus.BAD_REQUEST);
    }
    const validatePassword = await bcrypt.compare(
      newUser.password,
      userFind.password,
    );
    if (!validatePassword) {
      throw new UnauthorizedException('비밀번호를 확인해주세요');
    }
    return this.userService.delete(userFind);
  }

  async issuenewtoken(token: string): Promise<Newtoken> {
    let decoding = this.jwtService.decode(token);
    if (
      typeof decoding === 'object' &&
      decoding.email !== undefined &&
      decoding.name !== undefined
    ) {
      const payload = { email: decoding.email, name: decoding.name };
      const newToken = this.jwtService.sign(payload);

      return {
        newtoken: newToken,
        email: decoding.id,
        name: decoding.name,
      };
    }
  }

  async validateToken(token: string): Promise<Validation | Newtoken> {
    let decoding = this.jwtService.decode(token);
    if (typeof decoding === 'object' && decoding.exp !== undefined) {
      const { exp } = decoding;
      const date = new Date(exp * 1000);
      const now = new Date();
      const five = new Date(now.getTime() + 10 * 60000);
      if (date <= five) return this.issuenewtoken(token);
      else {
        return {
          email: decoding.email,
          name: decoding.name,
        };
      }
    }
  }
}
