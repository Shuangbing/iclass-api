import { Module } from '@nestjs/common';
import { SubjectModule } from 'src/subject/subject.module';
import { ClientController } from './client.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ClientService } from './client.service';
import { JwtClientStrategy } from './jwt-client.strategy';
import { GroupModule } from 'src/group/group.module';
import { MulterExtendedModule } from 'nestjs-multer-extended';
import { FileModule } from 'src/file/file.module';
import { MemberModule } from 'src/member/member.module';

@Module({
  imports: [
    SubjectModule,
    GroupModule,
    FileModule,
    MemberModule,
    JwtModule.register({
      secret: 'secretCodeClient',
      signOptions: { expiresIn: '3d' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt-client' }),
    MulterExtendedModule.register({
      endpoint: process.env.AWS_ENDPOINT,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'US',
      bucket: process.env.AWS_BUCKET || 'dev--iclass',
      basePath: process.env.AWS_BASE_PATH || 'group_upload',
      fileSize: 1 * 1024 * 1024,
    })
  ],
  controllers: [ClientController],
  exports: [ClientService],
  providers: [ClientService, JwtClientStrategy]
})
export class ClientModule { }
