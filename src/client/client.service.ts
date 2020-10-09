import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ClientService {
  constructor(
    private jwtService: JwtService
  ) { }

  async generateUser(user: any) {
    const payload = { userId: user.id, subjectCode: user.subjectCode, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(token: string) {
    const user = this.jwtService.verify(token)
    return user
  }
}
