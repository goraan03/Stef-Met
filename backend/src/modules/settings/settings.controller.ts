import {
    Controller,
    Get,
    Patch,
    Body,
    Param,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Public } from '@/common/decorators/public.decorator';

@Controller('settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Get()
    findAll() {
        return this.settingsService.findAll();
    }

    @Public()
    @Get('public')
    findPublic() {
        return this.settingsService.findPublic();
    }

    @Get(':key')
    findOne(@Param('key') key: string) {
        return this.settingsService.findOne(key);
    }

    @Patch(':key')
    update(@Param('key') key: string, @Body() updateSettingDto: UpdateSettingDto) {
        return this.settingsService.update(key, updateSettingDto);
    }
}