import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import slugify from 'slugify';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) { }

    async create(createCategoryDto: CreateCategoryDto) {
        const slug = slugify(createCategoryDto.name, {
            lower: true,
            strict: true,
        });

        const existing = await this.prisma.category.findUnique({
            where: { slug },
        });

        if (existing) {
            throw new ConflictException('Category with this name already exists');
        }

        return this.prisma.category.create({
            data: {
                ...createCategoryDto,
                slug,
            },
        });
    }

    async findAll() {
        return this.prisma.category.findMany({
            orderBy: { order: 'asc' },
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });
    }

    async findOne(id: string) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        return category;
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto) {
        await this.findOne(id);

        const data: any = { ...updateCategoryDto };

        if (updateCategoryDto.name) {
            data.slug = slugify(updateCategoryDto.name, {
                lower: true,
                strict: true,
            });
        }

        return this.prisma.category.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        const productsCount = await this.prisma.product.count({
            where: { categoryId: id },
        });

        if (productsCount > 0) {
            throw new ConflictException(
                'Cannot delete category with existing products',
            );
        }

        return this.prisma.category.delete({
            where: { id },
        });
    }
}