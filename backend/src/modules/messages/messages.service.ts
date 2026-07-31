import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
    constructor(private prisma: PrismaService) { }

    async create(createMessageDto: CreateMessageDto) {
        return this.prisma.message.create({
            data: createMessageDto,
        });
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
        const message = await this.findOne(id);

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