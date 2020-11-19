import { Controller, Get, Post, UseGuards, Request, Response, Body, UseFilters } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { UserLoginDto, UserSignUpDto } from './user/user.dto';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private userService: UserService
  ) { }

  @Get()
  apiVersion(): string {
    return this.appService.apiVersion();
  }

  @Post('auth/login')
  async login(@Body() userLoginDto: UserLoginDto, @Response() res: any) {
    const user = await this.authService.validateUser(userLoginDto.email, userLoginDto.password)
    const { access_token } = await this.authService.login(user);
    res.send({ access_token: access_token })
  }

  @Post('auth/signup')
  async signUp(@Body() userSignUpDto: UserSignUpDto) {
    return this.userService.createUser(userSignUpDto);
  }
}
