import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateMessageDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsNotEmpty()
    message: string;
}