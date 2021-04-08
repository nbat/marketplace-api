import {Injectable, NotFoundException} from '@nestjs/common';
import {Product} from "./entities/product.entity";

@Injectable()
export class ProductsService {
    private products: Product[] = [
        {
            id: 1,
            title: 'Lowpoly street racing car 3d model',
            brand: 'Lowpoly',
            slug: 'lowpoly-street-racing-car-3d-model',
            sku: '10548',
            tags: ['lowpoly muscle car', 'lowpoly racing car'],
        },
    ];

    findAll() {
        return this.products;
    }

    findOne(id: string) {
        const product = this.products.find(item => item.id === +id);
        if (!product) {
            throw new NotFoundException(`Product id ${id} not found`);
        }
        return product;
    }

    create(createProductDto: any) {
        this.products.push(createProductDto);
    }

    update(id: string, updateProductDto: any) {
        const existingProduct = this.findOne(id);
        if (existingProduct) {
            // Update Product
        }
    }

    remove(id: string) {
        const productIndex = this.products.findIndex(item => item.id === +id)
        if (productIndex >= 0) {
            this.products.splice(productIndex, 1)
        }
    }
}
