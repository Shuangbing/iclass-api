import { Module } from '@nestjs/common';
import { SubjectModule } from 'src/subject/subject.module';
import { ClientController } from './client.controller';

@Module({
    imports: [SubjectModule],
    controllers: [ClientController],
    exports: [ClientModule]
})
export class ClientModule {}
