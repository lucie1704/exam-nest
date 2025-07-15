import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { Public } from 'src/decorators/Public';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/registerDto';
import { SignInDto } from './dto/signInDto';
import { RequestTwoFactorDto, VerifyTwoFactorDto, LoginWithTwoFactorDto } from './dto/two-factor.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  signIn(@Body() signInDto: SignInDto) {
    // La connexion normale déclenche automatiquement la 2FA
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('register')
  @Public()
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('activate/:token')
  @Public()
  activate(@Param('token') token: string) {
    return this.authService.activateAccount(token);
  }

  @Post('2fa/request')
  @Public()
  @HttpCode(HttpStatus.OK)
  requestTwoFactorCode(@Body() requestDto: RequestTwoFactorDto) {
    return this.authService.requestTwoFactorCode(requestDto.email);
  }

  @Post('2fa/verify')
  @Public()
  @HttpCode(HttpStatus.OK)
  verifyTwoFactorCode(@Body() verifyDto: VerifyTwoFactorDto) {
    return this.authService.verifyTwoFactorCodePublic(verifyDto.email, verifyDto.code);
  }

  @Post('2fa/login')
  @Public()
  @HttpCode(HttpStatus.OK)
  signInWithTwoFactor(@Body() loginDto: LoginWithTwoFactorDto) {
    return this.authService.signInWithTwoFactor(
      loginDto.email,
      loginDto.password,
      loginDto.code,
    );
  }
}
