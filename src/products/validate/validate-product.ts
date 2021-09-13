export default async function validate(createProductDto, repo, id = -1) {
	const {name, price, promotion_price, image, categoryId} = createProductDto;
	
    // check empty
    if(!name || !price || !promotion_price) {
      return ['Vui lòng điền đầy đủ thông tin'];
    }

	if(!categoryId) {
		return ['Vui lòng chọn loại sản phẩm!'];
	}

	// check price
	if(parseFloat(price) <= 0 || parseFloat(promotion_price) <= 0) {
		return ['Giá sản phẩm phải lớn hơn 0'];
	}

	if(parseFloat(promotion_price) > parseFloat(price)) {
	
		return ['Giá khuyễn mãi không được lớn hơn giá gốc'];
	}

	//check update
	if(id !== -1) {
		const product = await repo.findOne({
			id: id,
			name: name
		});
		
		if(product) {
			return true;
		}
	}
	else {
		// check image
		if(!image) {
			return ['Vui lòng điền đầy đủ thông tin'];
		}
	}

	//check unique 
	const product = await repo.findOne({
		name: name
	});

	if(product) {
		return ['Tên sản phẩm đã tồn tại'];
	}
	return true;
}