import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsBoolean,
    IsEnum,
    IsDateString,
} from 'class-validator';
import { AnnouncementType } from '@prisma/client';

export class CreateAnnouncementDto {
    @IsEnum(AnnouncementType)
    @IsNotEmpty()
    type: AnnouncementType;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsOptional()
    excerpt?: string;

    @IsString()
    @IsOptional()
    imageUrl?: string;

    @IsBoolean()
    @IsOptional()
    visible?: boolean;

    @IsDateString()
    @IsOptional()
    publishedAt?: string;

    @IsDateString()
    @IsOptional()
    expiresAt?: string;
}