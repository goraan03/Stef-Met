import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsBoolean,
    IsArray,
    IsInt,
    Min,
} from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsNotEmpty()
    categoryId: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    images?: string[];

    @IsBoolean()
    @IsOptional()
    visible?: boolean;

    @IsInt()
    @Min(0)
    @IsOptional()
    order?: number;
}