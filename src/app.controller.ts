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

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Body() _: UserLoginDto, @Request() req: any, @Response() res: any) {
    const { access_token } = await this.authService.login(req.user);
    res.cookie('accessToken', access_token, { httpOnly: true })
    res.send({ message: 'Login Success.' })
  }

  @Post('auth/signup')
  async signUp(@Body() userSignUpDto: UserSignUpDto) {
    return this.userService.createUser(userSignUpDto);
  }
}
