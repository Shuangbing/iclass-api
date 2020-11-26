import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

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
  @Min(2)
  @Max(9)
  amount: number;
}

export class CreateCustomGroupDto {
  @IsArray()
  @ApiProperty()
  members: any;
}

export class UpdateSubjectDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;
}
