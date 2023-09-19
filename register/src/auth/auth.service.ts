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
  ): Promise<{ accessToken: string } | undefined> {
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
    const payload = { id: userFind.id };
    let accessToken = this.jwtService.sign(payload);

    return {
      accessToken: accessToken,
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

  async issuenewtoken(
    token: string,
  ): Promise<{ accessToken: string; user: Validation } | undefined> {
    let decoding = this.jwtService.decode(token);
    // let user = await this.userService.findByFields({
    //   where: { id: decoding.id },
    // });
    if (typeof decoding === 'object' && decoding.id !== undefined) {
      const { id } = decoding;
      const payload = { id };
      const newToken = this.jwtService.sign(payload);
      const user = await this.userService.findByFields({ where: { id: id } });
      // return;
      return {
        accessToken: newToken,
        user: {
          email: user.email,
          name: user.name,
        },
      };
    }
  }

  async validateToken(
    token: string,
  ): Promise<
    { accessToken: string; user: Validation } | { user: Validation } | undefined
  > {
    let decoding = this.jwtService.decode(token);
    if (!decoding) return null;
    if (typeof decoding === 'object' && decoding.exp !== undefined) {
      const { exp } = decoding;
      const date = new Date(exp * 1000);
      const now = new Date();
      const ten = new Date(now.getTime() + 10 * 60000);
      if (date <= ten) return this.issuenewtoken(token);
      else if (date < now) {
        return null;
      } else {
        const { id } = decoding;
        const user = await this.userService.findByFields({ where: { id: id } });
        return {
          accessToken: token,
          user: { email: user.email, name: user.name },
        };
      }
    }
  }
}
