import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
    constructor(private prisma: PrismaService) { }

    private readonly publicKeys = [
        'site_title',
        'site_description',
        'contact_email',
        'contact_phone',
        'contact_address',
        'social_facebook',
        'social_instagram',
        'business_hours',
    ];

    async findAll() {
        return this.prisma.setting.findMany({
            orderBy: { key: 'asc' },
        });
    }

    async findPublic() {
        return this.prisma.setting.findMany({
            where: {
                key: {
                    in: this.publicKeys,
                },
            },
        });
    }

    async findOne(key: string) {
        const setting = await this.prisma.setting.findUnique({
            where: { key },
        });

        if (!setting) {
            throw new NotFoundException('Setting not found');
        }

        return setting;
    }

    async update(key: string, updateSettingDto: UpdateSettingDto) {
        const setting = await this.prisma.setting.findUnique({
            where: { key },
        });

        if (!setting) {
            // Create if doesn't exist
            return this.prisma.setting.create({
                data: {
                    key,
                    ...updateSettingDto,
                },
            });
        }

        return this.prisma.setting.update({
            where: { key },
            data: updateSettingDto,
        });
    }
}