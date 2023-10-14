import { Resend } from 'resend';
import {
  CreateEmailOptions,
  CreateEmailResponse,
} from 'resend/build/src/emails/interfaces';
import Handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService extends Resend {
  constructor() {
    super(process.env.RESEND_API_KEY);
  }
  async send(
    data: Omit<CreateEmailOptions, 'from'> & { from?: string },
  ): Promise<CreateEmailResponse> {
    return this.emails.send({
      from: process.env.EMAIL_FROM || '',
      ...data,
    } as CreateEmailOptions);
  }

  async sendResetPasswordEmail({
    email,
    passwordResetLink,
  }: {
    email: string;
    passwordResetLink: string;
  }): Promise<CreateEmailResponse> {
    const template = await readFileSync(
      join(__dirname, '..', '..', 'emails', 'auth', 'reset-password.hbs'),
      'utf8',
    );
    const content = Handlebars.compile(template)({
      passwordResetLink,
      email,
    });
    return await this.send({
      to: email,
      subject: 'Reset Password',
      html: content,
    });
  }

  async sendVerificationEmail({
    email,
    emailVerifyLink,
  }: {
    email: string;
    emailVerifyLink: string;
  }): Promise<CreateEmailResponse> {
    const template = await readFileSync(
      join(__dirname, '..', '..', 'emails', 'auth', 'email-verification.hbs'),
      'utf8',
    );
    const content = Handlebars.compile(template)({
      verificationLink: emailVerifyLink,
      email,
    });
    return await this.send({
      to: email,
      subject: 'Email Verification',
      html: content,
    });
  }

  async sendAccountDeletionMail({
    email,
    accountDeletionLink,
  }: {
    email: string;
    accountDeletionLink: string;
  }): Promise<CreateEmailResponse> {
    const template = await readFileSync(
      join(__dirname, '..', '..', 'emails', 'auth', 'delete-account.hbs'),
      'utf8',
    );
    const content = Handlebars.compile(template)({
      accountDeletionLink,
      email,
    });
    return await this.send({
      to: email,
      subject: 'Delete Account Request',
      html: content,
    });
  }
}
