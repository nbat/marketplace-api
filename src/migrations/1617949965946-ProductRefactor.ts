import {MigrationInterface, QueryRunner} from "typeorm";

export class ProductRefactor1617949965946 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "products" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "products_tags_product_tag" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "products_tags_product_tag_entity" CASCAD`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
