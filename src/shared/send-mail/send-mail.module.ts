import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MessageErrorModule } from '../../message-error/message-error.module';
import { SendMailService } from './send-mail.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com' || config.get('EMAIL_HOST'),
          port: '587' || config.get('EMAIL_PORT'),
          secure: false, // true for 465, false for other ports
          // logger: true,
          // debug: true,
          auth: {
            user: 'kmagearmanagement@gmail.com' || config.get('EMAIL_ID'), // generated ethereal user
            pass: 'Phamduytai27112k' || config.get('EMAIL_PASS'), // generated ethereal password
          },
        },
        defaults: {
          from: 'kmagearmanagement@gmail.com' || config.get('EMAIL_ID'), // outgoing email ID
        },
        template: {
          dir: './src/shared/send-mail/template',
          adapter: new HandlebarsAdapter(), // or new PugAdapter()
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    MessageErrorModule,
  ],
  providers: [SendMailService],
  exports: [SendMailService],
})
export class SendMailModule {}
