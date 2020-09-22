import { Controller, Get, Post, UseGuards, Request, Response } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService
  ) { }

  @Get()
  index(): string {
    return this.appService.index();
  }

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req: any, @Response() res: any) {
    const { access_token } = await this.authService.login(req.user);
    res.cookie('accessToken', access_token, {
      httpOnly: true
    })
    res.send({ message: 'login success' })
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
