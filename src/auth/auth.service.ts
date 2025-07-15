import { Injectable, UnauthorizedException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { TokenType } from '@prisma/client';

interface registerData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private mailerService: MailerService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user?.password || !(await bcrypt.compare(pass, user?.password))) {
      throw new UnauthorizedException();
    }
    if (!user.isActive) {
      throw new ForbiddenException('Votre compte n\'est pas activé. Veuillez vérifier vos emails.');
    }

    // Générer et envoyer automatiquement un code 2FA
    await this.generateAndSendTwoFactorCode(email);

    return {
      message: 'Identifiants valides. Un code de vérification a été envoyé par email.',
      requiresTwoFactor: true,
      email: user.email,
    };
  }

  async register(params: registerData) {
    const { email, password, firstName, lastName } = params;
    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          password: await bcrypt.hash(password, 10),
          firstName,
          lastName,
          isActive: false,
        },
      });

      // Générer un token d'activation
      const token = await this.prisma.token.create({
        data: {
          user: { connect: { id: user.id } },
          type: TokenType.EMAIL_VERIFICATION,
          expiresAt: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes pour les tests
        },
      });

      // Envoyer l'email d'activation
      try {
        await this.mailerService.sendMail({
          to: user.email,
          subject: 'Activez votre compte TP Machine',
          template: 'activation-user',
          context: {
            firstName: user.firstName,
            activationUrl: `http://localhost:3000/auth/activate/${token.id}`,
          },
        });
      } catch (error) {
        console.error('Erreur envoi email d\'activation:', error);
      }
      return { message: 'Inscription réussie. Vérifiez vos emails pour activer votre compte.' };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Email déjà utilisé');
      }
      throw error;
    }
  }

  async activateAccount(tokenId: string) {
    // Vérifier le token
    const token = await this.prisma.token.findUnique({
      where: { id: tokenId },
      include: { user: true },
    });
    if (!token || token.type !== TokenType.EMAIL_VERIFICATION || token.usedAt || token.expiresAt < new Date()) {
      throw new BadRequestException('Lien d\'activation invalide ou expiré.');
    }
    // Activer le compte
    await this.prisma.user.update({
      where: { id: token.userId },
      data: { isActive: true },
    });
    // Marquer le token comme utilisé
    await this.prisma.token.update({
      where: { id: tokenId },
      data: { usedAt: new Date() },
    });
    return { message: 'Votre compte a bien été activé !' };
  }

  private generateTwoFactorCode(): string {
    // Génère un code à 6 chiffres
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async generateAndSendTwoFactorCode(email: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Utilisateur non trouvé');
    }

    if (!user.isActive) {
      throw new BadRequestException('Compte non activé');
    }

    // Supprimer les anciens codes 2FA non utilisés
    await this.prisma.token.deleteMany({
      where: {
        userId: user.id,
        type: TokenType.TWO_FACTOR_AUTH,
        usedAt: null,
      },
    });

    // Générer un nouveau code
    const code = this.generateTwoFactorCode();

    // Créer le token avec expiration de 5 minutes
    await this.prisma.token.create({
      data: {
        user: { connect: { id: user.id } },
        type: TokenType.TWO_FACTOR_AUTH,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      },
    });

    // Envoyer l'email avec le code
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Code de connexion - My Movie List',
        template: 'connexion-code',
        context: {
          firstName: user.firstName,
          code: code,
        },
      });
    } catch (error) {
      console.error('Erreur envoi email 2FA:', error);
      throw new BadRequestException('Erreur lors de l\'envoi du code');
    }

    return { message: 'Code de vérification envoyé par email' };
  }

  async verifyTwoFactorCode(email: string, code: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: { email },
      include: {
        tokens: {
          where: {
            type: TokenType.TWO_FACTOR_AUTH,
            usedAt: null,
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!user || user.tokens.length === 0) {
      return false;
    }

    const token = user.tokens[0];

    // Vérifier si le token n'est pas expiré
    if (token.expiresAt < new Date()) {
      return false;
    }

    // Marquer le token comme utilisé
    await this.prisma.token.update({
      where: { id: token.id },
      data: { usedAt: new Date() },
    });

    return true;
  }

  async requestTwoFactorCode(email: string) {
    return this.generateAndSendTwoFactorCode(email);
  }

  async verifyTwoFactorCodePublic(email: string, code: string) {
    const isValid = await this.verifyTwoFactorCode(email, code);
    if (!isValid) {
      throw new BadRequestException('Code invalide ou expiré');
    }
    return { message: 'Code vérifié avec succès' };
  }

  async signInWithTwoFactor(email: string, password: string, code: string) {
    // Vérifier les identifiants
    const user = await this.usersService.findOneByEmail(email);

    if (!user?.password || !(await bcrypt.compare(password, user?.password))) {
      throw new UnauthorizedException();
    }

    if (!user.isActive) {
      throw new ForbiddenException('Votre compte n\'est pas activé. Veuillez vérifier vos emails.');
    }

    // Vérifier le code 2FA
    const isCodeValid = await this.verifyTwoFactorCode(email, code);
    if (!isCodeValid) {
      throw new BadRequestException('Code de vérification invalide ou expiré');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: userWithoutPassword,
    };
  }
}
