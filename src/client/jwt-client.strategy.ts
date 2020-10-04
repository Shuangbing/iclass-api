import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
const { cookieExtractor } = require('./jwt.function');

@Injectable()
export class JwtClientStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: 'secretCodeClient',
    });
  }

  async validate(payload: any) {
    return { userId: payload.userId, subjectCode: payload.subjectCode, name: payload.name };
  }
}