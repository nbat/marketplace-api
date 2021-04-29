import {Module} from '@nestjs/common';
import {ProductsController} from "./products.controller";
import {ProductsService} from "./products.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Product} from "./entities/product-entity";
import {ProductTag} from "./entities/product-entity.tag";
import {Event} from "../events/entities/event.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Product, ProductTag, Event])],
    controllers: [ProductsController],
    providers: [ProductsService],
    exports: [ProductsService],
})
export class ProductsModule {
}
