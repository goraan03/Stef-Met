import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateSettingDto {
    @IsString()
    @IsNotEmpty()
    value: string;

    @IsString()
    @IsOptional()
    type?: string;

    @IsString()
    @IsOptional()
    description?: string;
}