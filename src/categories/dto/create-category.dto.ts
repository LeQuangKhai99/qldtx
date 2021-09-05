import { IsNotEmpty } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty({message: 'Tên không được rỗng!'})
    readonly name: string;
}
