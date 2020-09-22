export class UserLoginDto {
    email: string;
    password: string;
}

export class UserSignUpDto extends UserLoginDto {
    firstName: string;
    lastName: string;
}
