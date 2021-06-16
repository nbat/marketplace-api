import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {ProductsService} from "./products.service";
import {CreateProductDto} from "./dto/create-product.dto";
import {UpdateProductDto} from "./dto/update-product.dto";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {Public} from "../common/decorators/public.decorator";
import {ParseIntPipe} from "../common/pipes/parse-int.pipe";
import {Protocol} from "../common/decorators/protocol.decorator";
import {ApiForbiddenResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {
    }

    @ApiForbiddenResponse({ description: 'Forbidden.' })
    @Get()
    @Public()
    async findAll(@Query() paginationQuery: PaginationQueryDto) {
        return this.productsService.findAll(paginationQuery);
    }

    @Get(':id')
    @Public()
    findOne(@Protocol() protocol: string,
            @Param('id', ParseIntPipe) id: number) {
        return this.productsService.findOne(id);
    }

    @Post()
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
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
