import { IsEmail, IsString, Length } from 'class-validator';

export class RequestTwoFactorDto {
  @IsEmail()
  email: string;
}

export class VerifyTwoFactorDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 6)
  code: string;
}

export class LoginWithTwoFactorDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @Length(6, 6)
  code: string;
} 