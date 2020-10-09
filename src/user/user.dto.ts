import { ApiProperty } from "@nestjs/swagger";

export class UserLoginDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class UserSignUpDto extends UserLoginDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}
