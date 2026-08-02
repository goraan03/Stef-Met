import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MessagesService {
    private readonly logger = new Logger(MessagesService.name);

    constructor(private prisma: PrismaService) { }

    private createTransporter() {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    private async sendContactEmail(message: CreateMessageDto) {
        const toEmail = process.env.CONTACT_EMAIL_TO || 'dragoste69@gmail.com';
        const fromUser = process.env.SMTP_USER;

        if (!fromUser || !process.env.SMTP_PASS) {
            this.logger.warn('SMTP credentials not configured. Email notification skipped.');
            return;
        }

        const transporter = this.createTransporter();

        const mailOptions = {
            from: `"Stef-Mat Kontakt Forma" <${fromUser}>`,
            to: toEmail,
            replyTo: message.email,
            subject: `Nova poruka od: ${message.name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #1e40af; padding: 24px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 22px;">Nova poruka sa kontakt forme</h1>
                        <p style="color: #bfdbfe; margin: 8px 0 0;">Stef-Mat d.o.o.</p>
                    </div>
                    <div style="padding: 32px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px; width: 130px;"><strong>Ime i prezime:</strong></td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${message.name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;"><strong>E-mail:</strong></td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;"><a href="mailto:${message.email}" style="color: #1e40af;">${message.email}</a></td>
                            </tr>
                            ${message.phone ? `
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;"><strong>Telefon:</strong></td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${message.phone}</td>
                            </tr>
                            ` : ''}
                        </table>
                        <div style="margin-top: 24px;">
                            <p style="color: #6b7280; font-size: 14px; margin-bottom: 8px;"><strong>Poruka:</strong></p>
                            <div style="background: #f9fafb; border-left: 4px solid #1e40af; padding: 16px; border-radius: 4px; color: #374151; white-space: pre-line; line-height: 1.6;">
                                ${message.message}
                            </div>
                        </div>
                        <div style="margin-top: 24px; padding: 16px; background: #eff6ff; border-radius: 8px;">
                            <p style="color: #1e40af; font-size: 13px; margin: 0;">
                                💡 Možeš odgovoriti direktno na ovaj email — odgovor će stići na adresu pošiljaoca.
                            </p>
                        </div>
                    </div>
                    <div style="background: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="color: #9ca3af; font-size: 12px; margin: 0;">Stef-Mat d.o.o. — Automatska notifikacija</p>
                    </div>
                </div>
            `,
        };

        try {
            await transporter.sendMail(mailOptions);
            this.logger.log(`Contact email sent successfully to ${toEmail}`);
        } catch (error) {
            // We log the error but don't throw — the message is already saved to DB
            this.logger.error('Failed to send contact email notification', error);
        }
    }

    async create(createMessageDto: CreateMessageDto) {
        const message = await this.prisma.message.create({
            data: createMessageDto,
        });

        // Fire email notification (non-blocking, doesn't fail the request if email fails)
        this.sendContactEmail(createMessageDto);

        return message;
    }

    async findAll(filters?: { isRead?: boolean }) {
        const where: any = {};

        if (filters?.isRead !== undefined) {
            where.isRead = filters.isRead;
        }

        return this.prisma.message.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const message = await this.prisma.message.findUnique({
            where: { id },
        });

        if (!message) {
            throw new NotFoundException('Message not found');
        }

        return message;
    }

    async markAsRead(id: string) {
        await this.findOne(id);

        return this.prisma.message.update({
            where: { id },
            data: { isRead: true },
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        return this.prisma.message.delete({
            where: { id },
        });
    }
}