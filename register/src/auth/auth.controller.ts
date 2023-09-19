import {
  Controller,
  Post,
  Req,
  Body,
  Get,
  Patch,
  Res,
  Response,
} from '@nestjs/common';
import { UserDTO, Change, Validation } from './dto/user.dto';
import { AuthService } from './auth.service';
import { Request } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  async singup(
    @Req() req: Request,
    @Body() UserDTO: UserDTO,
  ): Promise<UserDTO> {
    return await this.authService.registerUser(UserDTO);
  }

  @Post('/login')
  async login(
    @Body() UserDTO: UserDTO,
  ): Promise<{ accessToken: string } | undefined> {
    return await this.authService.validateUser(UserDTO);
  }

  @Patch('/change')
  async update(@Req() req: Request, @Body() Change: Change): Promise<string> {
    return await this.authService.change(Change);
  }

  @Get('/token')
  async token(
    @Req() req: Request,
  ): Promise<
    { accessToken: string; user: Validation } | { user: Validation } | undefined
  > {
    const tokenData = req.headers['authorization'].split(' ')[1];
    if (tokenData) return await this.authService.validateToken(tokenData);
  }
  // @Delete('/deleteUser')
  // async del(
  //   @Req() req: Request,
  //   @Body() UserDTO: UserDTO,
  // ): Promise<string | undefined> {
  //   return await this.authService.deleteUser(UserDTO);
  // }
}
