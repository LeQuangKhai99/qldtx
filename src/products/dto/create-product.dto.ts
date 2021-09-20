export class CreateProductDto {
	// @Validate(ProductExistsRule)
	name: string;

	slug: string;

	price: number;

	promotion_price: number;

	categoryId: number;
}
