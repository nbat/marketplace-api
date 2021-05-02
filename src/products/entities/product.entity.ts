import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

@Schema()
export class Product extends Document{
    @Prop()
    title: string;
    @Prop()
    brand: string;
    @Prop()
    slug: string;
    @Prop()
    sku: string;
    @Prop([String])
    tags: string[];

    @Prop({default: 0})
    recommendations: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);