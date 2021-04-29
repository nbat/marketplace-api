import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {ProductTag} from "./product-entity.tag";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    brand: string;

    @Column()
    slug: string;

    @Column()
    sku: string;

    @Column({default: 0})
    recommendations: number;

    @JoinTable()
    @ManyToMany(
        type => ProductTag,
        productTag => productTag.products,
        {
            cascade: true,
        }
    )
    tags: ProductTag[];
}