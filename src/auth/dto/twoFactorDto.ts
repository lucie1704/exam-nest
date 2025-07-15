import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class RequestTwoFactorDto {
  @ApiProperty({ 
    description: 'Email de l\'utilisateur',
    example: 'user@example.com'
  })
  @IsEmail()
  email: string;
}

export class VerifyTwoFactorDto {
  @ApiProperty({ 
    description: 'Email de l\'utilisateur',
    example: 'user@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    description: 'Code 2FA à 6 chiffres',
    example: '123456',
    minLength: 6,
    maxLength: 6
  })
  @IsString()
  @Length(6, 6)
  code: string;
}

export class LoginWithTwoFactorDto {
  @ApiProperty({ 
    description: 'Email de l\'utilisateur',
    example: 'user@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    description: 'Mot de passe de l\'utilisateur',
    example: 'password123'
  })
  @IsString()
  password: string;

  @ApiProperty({ 
    description: 'Code 2FA à 6 chiffres',
    example: '123456',
    minLength: 6,
    maxLength: 6
  })
  @IsString()
  @Length(6, 6)
  code: string;
} 