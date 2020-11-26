import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('file')
@UseGuards(AuthGuard('jwt-teacher'))
export class FileController {}
