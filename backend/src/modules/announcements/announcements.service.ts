import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { AnnouncementType } from '@prisma/client';
import slugify from 'slugify';

@Injectable()
export class AnnouncementsService {
    constructor(private prisma: PrismaService) { }

    async create(createAnnouncementDto: CreateAnnouncementDto) {
        const slug = slugify(createAnnouncementDto.title, {
            lower: true,
            strict: true,
        });

        const existing = await this.prisma.announcement.findUnique({
            where: { slug },
        });

        if (existing) {
            throw new ConflictException('Announcement with this title already exists');
        }

        return this.prisma.announcement.create({
            data: {
                ...createAnnouncementDto,
                slug,
            },
        });
    }

    async findAll(filters?: {
        type?: AnnouncementType;
        visible?: boolean;
    }) {
        const where: any = {};

        if (filters?.type) {
            where.type = filters.type;
        }

        if (filters?.visible !== undefined) {
            where.visible = filters.visible;
        }

        // For public queries, only show non-expired announcements
        if (filters?.visible === true) {
            where.OR = [
                { expiresAt: null },
                { expiresAt: { gt: new Date() } },
            ];
        }

        return this.prisma.announcement.findMany({
            where,
            orderBy: { publishedAt: 'desc' },
        });
    }

    async findOne(slug: string) {
        const announcement = await this.prisma.announcement.findUnique({
            where: { slug },
        });

        if (!announcement) {
            throw new NotFoundException('Announcement not found');
        }

        return announcement;
    }

    async update(id: string, updateAnnouncementDto: UpdateAnnouncementDto) {
        const announcement = await this.prisma.announcement.findUnique({
            where: { id },
        });

        if (!announcement) {
            throw new NotFoundException('Announcement not found');
        }

        const data: any = { ...updateAnnouncementDto };
        const updateDto = updateAnnouncementDto as any;

        if (updateDto.title && updateDto.title !== announcement.title) {
            data.slug = slugify(updateDto.title, {
                lower: true,
                strict: true,
            });
        }

        return this.prisma.announcement.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        const announcement = await this.prisma.announcement.findUnique({
            where: { id },
        });

        if (!announcement) {
            throw new NotFoundException('Announcement not found');
        }

        return this.prisma.announcement.delete({
            where: { id },
        });
    }
}