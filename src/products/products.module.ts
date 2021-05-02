import {Module} from '@nestjs/common';
import {ProductsController} from "./products.controller";
import {ProductsService} from "./products.service";
import {MongooseModule} from "@nestjs/mongoose";
import {Product, ProductSchema} from "./entities/product.entity";
import {EventSchema} from "../events/entities/event.entity";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Product.name,
                schema: ProductSchema
            },
            {
                name: Event.name,
                schema: EventSchema
            }
        ]),
    ],
    controllers: [ProductsController],
    providers: [ProductsService]
})
export class ProductsModule {
}
