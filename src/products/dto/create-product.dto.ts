import {IsString} from "class-validator";

export class CreateProductDto {
    @IsString()
    readonly title: string;

    @IsString()
    readonly brand: string;

    @IsString()
    readonly slug: string;

    @IsString()
    readonly sku: string;

    @IsString({each: true})
    readonly tags: string[];
}