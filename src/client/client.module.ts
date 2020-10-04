import { Module } from '@nestjs/common';
import { SubjectModule } from 'src/subject/subject.module';
import { ClientController } from './client.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ClientService } from './client.service';
import { JwtClientStrategy } from './jwt-client.strategy';
import { ChatModule } from './chat/chat.module';
import { GroupModule } from 'src/group/group.module';

@Module({
  imports: [
    SubjectModule,
    GroupModule,
    JwtModule.register({
      secret: 'secretCodeClient',
      signOptions: { expiresIn: '3d' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),

  ],
  controllers: [ClientController],
  exports: [ClientService],
  providers: [ClientService, JwtClientStrategy]
})
export class ClientModule { }
