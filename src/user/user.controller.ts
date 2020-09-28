import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { User } from './user.entity';
import { UserService } from './user.service';

@ApiTags('user')
@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  getAllUsers() {
    return this.userService.findAll();
  }

  @Get('subjects')
  getAllUsersWithProjects() {
    return this.userService.findAllWithProjects();
  }

  @Get('profile')
  getProfile(@Request() req: any) {
    const user = this.userService.findOneById(req.user.id);
    return user;
  }

}
