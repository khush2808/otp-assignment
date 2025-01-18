import nodemailer from 'nodemailer';
import { config } from '../config';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: false,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }

  async sendOTP(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: config.email.user,
      to: email,
      subject: 'Your OTP for Authentication',
      text: `Your OTP is: ${otp}. It will expire in ${config.otpExpiryMinutes} minutes.`,
      html: `
        <h1>Authentication OTP</h1>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>It will expire in ${config.otpExpiryMinutes} minutes.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}

export const emailService = new EmailService();