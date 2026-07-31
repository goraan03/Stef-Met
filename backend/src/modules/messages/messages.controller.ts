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
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Public } from '@/common/decorators/public.decorator';

@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) { }

    @Public()
    @Post()
    create(@Body() createMessageDto: CreateMessageDto) {
        return this.messagesService.create(createMessageDto);
    }

    @Get()
    findAll(@Query('isRead') isRead?: string) {
        return this.messagesService.findAll({
            isRead: isRead === 'true' ? true : isRead === 'false' ? false : undefined,
        });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.messagesService.findOne(id);
    }

    @Patch(':id/read')
    markAsRead(@Param('id') id: string) {
        return this.messagesService.markAsRead(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.messagesService.remove(id);
    }
}