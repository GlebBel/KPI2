import {MigrationInterface, QueryRunner} from 'typeorm';

export class CreateTables1564039804936 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const createClothesTypesTableSQL = `
        CREATE TYPE CLOTHES_TYPE AS ENUM (
                'SHOES',
                'CLOTHES',
                'ACCESSORIES'
            );
         `;

        const createClothesTableSQL = `
        CREATE TABLE clothes (
            id BIGSERIAL PRIMARY KEY,
            clothes_type CLOTHES_TYPE,
            name VARCHAR(40) NOT NULL,
            price FLOAT(2) NOT NULL,
            discount FLOAT(1),
            description VARCHAR(1024) NOT NULL
        );
         `;

        await queryRunner.query(createClothesTypesTableSQL);
        await queryRunner.query(createClothesTableSQL);
        await queryRunner.commitTransaction();
        await queryRunner.startTransaction();
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
