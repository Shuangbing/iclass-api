import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtClientStrategy extends PassportStrategy(Strategy, 'jwt-client') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.CLIENT_SECRET || 'secretCodeClient',
    });
  }

  async validate(payload: any) {
    return { userId: payload.userId, subjectCode: payload.subjectCode, name: payload.name, groupId: payload.groupId };
  }
}