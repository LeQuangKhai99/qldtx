import { Category } from "src/categories/entities/category.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    slug: string;

    @Column("decimal", {precision: 15, scale: 2})
    price: number;

    @Column("decimal", {precision: 15, scale: 2})
    promotion_price: number;

    @Column()
    image: string;

    @ManyToOne(type => Category, cate => cate.products)
    category: Category;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
    
}
