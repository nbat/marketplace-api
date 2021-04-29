import {IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateProductDto {
    @IsString()
    @ApiProperty({ description: 'The title of the product' })
    readonly title: string;

    @IsString()
    @ApiProperty({ description: 'The product brand' })
    readonly brand: string;

    @IsString()
    @ApiProperty({ description: 'The product slug that will be used in URLs' })
    readonly slug: string;

    @IsString()
    @ApiProperty({ description: 'Unique sku number of the product' })
    readonly sku: string;

    @IsString({each: true})
    @ApiProperty({ description: 'Product tags' })
    readonly tags: string[];
}