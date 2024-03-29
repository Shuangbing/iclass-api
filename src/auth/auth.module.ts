import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport/dist/passport.module';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.TEACHER_SECRET || 'secretCode',
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt-teacher' }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule { }
