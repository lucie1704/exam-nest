import { Controller, Get, Post, Body } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Public } from './decorators/Public';
import { AppService } from './app.service';

// /
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly mailerService: MailerService,
  ) {}

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }
}
