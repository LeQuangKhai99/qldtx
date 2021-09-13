import { IsNumber, Validate } from "class-validator";
import { ProductExistsRule } from "../validate/product-exist-rule";

export class CreateProductDto {
	// @Validate(ProductExistsRule)
	name: string;

	slug: string;

	price: number;

	promotion_price: number;

	image: string;

	categoryId: number;
}
