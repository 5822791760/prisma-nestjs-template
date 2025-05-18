import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

import { AppConfig } from '@core/config';

export const NODE_MAILER = Symbol('NODE_MAILER');

export const NodeMailerProvider: Provider = {
  provide: NODE_MAILER,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): Mail => {
    const emailConfig = configService.getOrThrow<AppConfig['email']>('email');

    if (!emailConfig) {
      throw new Error('no email config');
    }

    return createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.password,
      },
    });
  },
};
