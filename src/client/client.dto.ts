import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class JionSubjectDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  subjectCode: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;
}