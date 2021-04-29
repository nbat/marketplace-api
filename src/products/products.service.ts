import {Injectable, NotFoundException} from '@nestjs/common';
import {Product} from "./entities/product-entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Connection, Repository} from "typeorm";
import {CreateProductDto} from "./dto/create-product.dto";
import {UpdateProductDto} from "./dto/update-product.dto";
import {ProductTag} from "./entities/product-entity.tag";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {Event} from "../events/entities/event.entity"

@Injectable()
export class ProductsService {

    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(ProductTag)
        private readonly productTagRepository: Repository<ProductTag>,
        private readonly connection: Connection
    ) {
    }

    findAll(paginationQueryDto: PaginationQueryDto) {
        const {limit, offset} = paginationQueryDto;

        return this.productRepository.find({
            relations: ['tags'],
            skip: offset,
            take: limit,
        });
    }

    async findOne(id: number) {
        const product = await this.productRepository.findOne(id, {
            relations: ['tags']
        });
        if (!product) {
            throw new NotFoundException(`Product id ${id} not found`);
        }
        return product;
    }

    async create(createProductDto: CreateProductDto) {
        const productTags = await Promise.all(
            createProductDto.tags.map(name => this.preloadProductTagByName(name))
        );
        const product = this.productRepository.create({
            ...createProductDto,
            tags: productTags,
        });
        return this.productRepository.save(product);
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        const productTags = updateProductDto.tags &&
            (
                await Promise.all(
                    updateProductDto.tags.map(name => this.preloadProductTagByName(name))
                )
            );
        const product = await this.productRepository.preload({
            id: +id,
            ...updateProductDto,
            tags: productTags
        });
        if (!product) {
            throw new NotFoundException(`Product id ${id} not found`);
        }
        this.productRepository.save(product)
    }

    async remove(id: string) {
        const product = await this.productRepository.findOne(+id);
        return this.productRepository.remove(product);
    }

    async recommendProduct(product: Product) {
        const queryRunner = this.connection.createQueryRunner()
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            product.recommendations++;

            const recommendEvent = new Event();
            recommendEvent.name = 'recommend_product';
            recommendEvent.type = 'product';
            recommendEvent.payload = {productId: product.id}

            await queryRunner.manager.save(product);
            await queryRunner.manager.save(recommendEvent);

            await queryRunner.commitTransaction();

        } catch {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    private async preloadProductTagByName(name: string): Promise<ProductTag> {
        const existingProductTag = await this.productTagRepository.findOne({name});
        if (existingProductTag) {
            return existingProductTag;
        }
        return this.productTagRepository.create({name})
    }
}
