import {Injectable, NotFoundException} from '@nestjs/common';
import {Product} from "./entities/product.entity";
import {InjectConnection, InjectModel} from "@nestjs/mongoose";
import {Connection, Model} from "mongoose";
import {UpdateProductDto} from "./dto/update-product.dto";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {Event} from "../events/entities/event.entity";

@Injectable()
export class ProductsService {

    constructor(
        @InjectModel(Product.name) private readonly productModel: Model<Product>,
        @InjectConnection() private readonly connection: Connection,
        @InjectModel(Event.name) private readonly eventModel: Model<Event>
    ) {
    }

    findAll(paginationQuery: PaginationQueryDto) {
        const {limit, offset} = paginationQuery;
        return this.productModel
            .find()
            .skip(offset)
            .limit(limit)
            .exec();
    }

    async findOne(id: string) {
        const product = await this.productModel.findOne({_id: id}).exec();
        if (!product) {
            throw new NotFoundException(`Product id ${id} not found`);
        }
        return product;
    }

    create(createProductDto: any) {
        const product = new this.productModel(createProductDto);
        return product.save()
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        const existingProduct = await this.productModel
            .findOneAndUpdate({_id: id}, {$set: updateProductDto}, {new: true})
            .exec()

        if (!existingProduct) {
            throw new NotFoundException(`Product ${id} not found`)
        }

        return existingProduct;
    }

    async remove(id: string) {
        const product = await this.findOne(id);
        return product.remove();
    }

    async recommendProduct(product: Product) {
        const session = await this.connection.startSession();
        session.startTransaction();

        try {
            product.recommendations++;

            const recommendEvent = new this.eventModel({
                name: 'recommend_product',
                type: 'product',
                payload: {productId: product.id}
            });

            await recommendEvent.save();
            await product.save();

            await session.commitTransaction();
        } catch (err) {
            await session.abortTransaction();
        } finally {
            session.endSession()
        }
    }
}
