import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserSignUpDto } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('signup')
  public signUp(@Body() req: UserSignUpDto) {
    return this.userService.createUser(req.email, req.password, req.firstName, req.lastName);
  }

  @Get()
  getAllUsers() {
    return this.userService.findAll();
  }

  @Get('/subjects')
  getAllUsersWithProjects() {
    return this.userService.findAllWithProjects();
  }

}
