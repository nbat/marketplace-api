import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Product} from "./product-entity";

@Entity()
export class ProductTag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(
        type => Product,
        product => product.tags
    )
    products: Product[];
}
