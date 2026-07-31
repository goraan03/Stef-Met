import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { Public } from '@/common/decorators/public.decorator';
import { AnnouncementType } from '@prisma/client';

@Controller('announcements')
export class AnnouncementsController {
    constructor(private readonly announcementsService: AnnouncementsService) { }

    @Post()
    create(@Body() createAnnouncementDto: CreateAnnouncementDto) {
        return this.announcementsService.create(createAnnouncementDto);
    }

    @Public()
    @Get()
    findAll(
        @Query('type') type?: AnnouncementType,
        @Query('visible') visible?: string,
    ) {
        return this.announcementsService.findAll({
            type,
            visible: visible === 'true' ? true : visible === 'false' ? false : undefined,
        });
    }

    @Public()
    @Get(':slug')
    findOne(@Param('slug') slug: string) {
        return this.announcementsService.findOne(slug);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateAnnouncementDto: UpdateAnnouncementDto,
    ) {
        return this.announcementsService.update(id, updateAnnouncementDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.announcementsService.remove(id);
    }
}