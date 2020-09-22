import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  permitPreGroup?: boolean = true;
}