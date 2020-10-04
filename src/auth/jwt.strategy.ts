import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
const { cookieExtractor } = require('./jwt.function');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-teacher') {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: 'secretCode',
    });
  }

  async validate(payload: any) {
    console.log(payload)
    return { id: payload.id, email: payload.email };
  }
}