import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { Public } from 'src/decorators/Public';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/registerDto';
import { SignInDto } from './dto/signInDto';
import { RequestTwoFactorDto, VerifyTwoFactorDto, LoginWithTwoFactorDto } from './dto/twoFactorDto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Connexion utilisateur (déclenche 2FA)' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({ status: 200, description: 'Code 2FA envoyé par email' })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  signIn(@Body() signInDto: SignInDto) {
    // La connexion normale déclenche automatiquement la 2FA
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @ApiOperation({ summary: 'Inscription d\'un nouvel utilisateur' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Utilisateur créé, email d\'activation envoyé' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  @Post('register')
  @Public()
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Activation du compte utilisateur' })
  @ApiParam({ name: 'token', description: 'Token d\'activation reçu par email' })
  @ApiResponse({ status: 200, description: 'Compte activé avec succès' })
  @ApiResponse({ status: 400, description: 'Token invalide ou expiré' })
  @Get('activate/:token')
  @Public()
  activate(@Param('token') token: string) {
    return this.authService.activateAccount(token);
  }

  @ApiOperation({ summary: 'Demander un code 2FA' })
  @ApiBody({ type: RequestTwoFactorDto })
  @ApiResponse({ status: 200, description: 'Code 2FA envoyé par email' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  @Post('2fa/request')
  @Public()
  @HttpCode(HttpStatus.OK)
  requestTwoFactorCode(@Body() requestDto: RequestTwoFactorDto) {
    return this.authService.requestTwoFactorCode(requestDto.email);
  }

  @ApiOperation({ summary: 'Vérifier un code 2FA' })
  @ApiBody({ type: VerifyTwoFactorDto })
  @ApiResponse({ status: 200, description: 'Code 2FA vérifié' })
  @ApiResponse({ status: 400, description: 'Code invalide ou expiré' })
  @Post('2fa/verify')
  @Public()
  @HttpCode(HttpStatus.OK)
  verifyTwoFactorCode(@Body() verifyDto: VerifyTwoFactorDto) {
    return this.authService.verifyTwoFactorCodePublic(verifyDto.email, verifyDto.code);
  }

  @ApiOperation({ summary: 'Connexion complète avec 2FA' })
  @ApiBody({ type: LoginWithTwoFactorDto })
  @ApiResponse({ status: 200, description: 'Connexion réussie, token JWT retourné' })
  @ApiResponse({ status: 401, description: 'Identifiants ou code 2FA invalides' })
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
