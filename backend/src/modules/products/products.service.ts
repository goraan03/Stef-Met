import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import slugify from 'slugify';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async create(createProductDto: CreateProductDto) {
        // Verify category exists
        const category = await this.prisma.category.findUnique({
            where: { id: createProductDto.categoryId },
        });

        if (!category) {
            throw new BadRequestException('Category not found');
        }

        const slug = slugify(createProductDto.name, {
            lower: true,
            strict: true,
        });

        const existing = await this.prisma.product.findUnique({
            where: { slug },
        });

        if (existing) {
            throw new ConflictException('Product with this name already exists');
        }

        return this.prisma.product.create({
            data: {
                ...createProductDto,
                slug,
            },
            include: {
                category: true,
            },
        });
    }

    async findAll(filters?: {
        categoryId?: string;
        visible?: boolean;
        search?: string;
    }) {
        const where: any = {};

        if (filters?.categoryId) {
            where.categoryId = filters.categoryId;
        }

        if (filters?.visible !== undefined) {
            where.visible = filters.visible;
        }

        if (filters?.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        return this.prisma.product.findMany({
            where,
            include: {
                category: true,
            },
            orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        });
    }

    async findOne(slug: string) {
        const product = await this.prisma.product.findUnique({
            where: { slug },
            include: {
                category: true,
            },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        if (updateProductDto.categoryId) {
            const category = await this.prisma.category.findUnique({
                where: { id: updateProductDto.categoryId },
            });

            if (!category) {
                throw new BadRequestException('Category not found');
            }
        }

        const data: any = { ...updateProductDto };

        if (updateProductDto.name && updateProductDto.name !== product.name) {
            data.slug = slugify(updateProductDto.name, {
                lower: true,
                strict: true,
            });
        }

        return this.prisma.product.update({
            where: { id },
            data,
            include: {
                category: true,
            },
        });
    }

    async remove(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return this.prisma.product.delete({
            where: { id },
        });
    }
}