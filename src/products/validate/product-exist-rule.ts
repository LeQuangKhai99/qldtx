import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { useContainer } from "typeorm";
import { ProductsService } from "../products.service";

@ValidatorConstraint({name:'ProductExists', async: true})
@Injectable()
export class ProductExistsRule implements ValidatorConstraintInterface {
	constructor(
		private readonly productService: ProductsService
	){}

	async validate(name: string) {
		// try {
			
			
		// } catch (e) {
		// 	throw new HttpException({
		// 		status: HttpStatus.BAD_REQUEST,
		// 		error: 'Sản phẩm không tồn tại!',
		// 		redirect: '/admin/products/add'
		// 	}, HttpStatus.BAD_REQUEST);
		// }
		const s = await this.productService.findByName(name);
		console.log(s);

		return true;
	}

	defaultMessage(args: ValidationArguments) {
		return `Product doesn't exist`;
	  }
}