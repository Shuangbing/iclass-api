import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsBoolean()
  @ApiProperty()
  permitPreGroup?: boolean = true;
}

export class CreateGroupDto {
  @IsNumber()
  @ApiProperty()
  @Min(1)
  @Max(15)
  amount: number;
}