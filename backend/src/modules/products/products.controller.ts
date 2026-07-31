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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Public } from '../../common/decorators/public.decorator';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Public()
    @Get()
    findAll(
        @Query('categoryId') categoryId?: string,
        @Query('visible') visible?: string,
        @Query('search') search?: string,
    ) {
        return this.productsService.findAll({
            categoryId,
            visible: visible === 'true' ? true : visible === 'false' ? false : undefined,
            search,
        });
    }

    @Public()
    @Get(':slug')
    findOne(@Param('slug') slug: string) {
        return this.productsService.findOne(slug);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}