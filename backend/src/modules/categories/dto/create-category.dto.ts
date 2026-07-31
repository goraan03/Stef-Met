import { IsString, IsNotEmpty, IsInt, IsOptional, Min } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    order?: number;
}