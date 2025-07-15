import { Controller, Get, Post, Body } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { AppService } from './app.service';

// /
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly mailerService: MailerService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('test-email')
  async testEmail(@Body() body: { to: string; firstName: string }) {
    try {
      await this.mailerService.sendMail({
        to: body.to,
        subject: 'Test Email - TP Machine',
        template: 'welcome-student',
        context: {
          firstName: body.firstName,
          url: 'http://localhost:3000/test-confirmation',
        },
      });
      
      return { 
        success: true, 
        message: 'Email envoyé avec succès',
        sentTo: body.to 
      };
    } catch (error) {
      console.error('Erreur envoi email:', error);
      return { 
        success: false, 
        error: error.message,
        details: error 
      };
    }
  }

  @Post('test-simple-email')
  async testSimpleEmail(@Body() body: { to: string }) {
    try {
      await this.mailerService.sendMail({
        to: body.to,
        subject: 'Test Simple Email',
        text: 'Ceci est un test simple d\'envoi d\'email.',
        html: '<h1>Test Email</h1><p>Ceci est un test simple d\'envoi d\'email.</p>',
      });
      
      return { 
        success: true, 
        message: 'Email simple envoyé avec succès',
        sentTo: body.to 
      };
    } catch (error) {
      console.error('Erreur envoi email simple:', error);
      return { 
        success: false, 
        error: error.message,
        details: error 
      };
    }
  }
}
