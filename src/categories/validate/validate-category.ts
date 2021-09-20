export default async function validate(createCategoryDto, repo, file, id = -1) {
	const {name} = createCategoryDto;
    // check empty
    if(!name) {
      return ['Vui lòng điền tên loại sản phẩm'];
    }

	//check update
	if(id !== -1) {
		const cate = await repo.findOne({
			id: id,
			name: name
		});
		
		if(cate) {
			return true;
		}
	}
	else {
		// check image
		if(!file) {
			return ['Vui lòng điền đầy đủ thông tin'];
		}
	}

	if (file && !file.originalname?.match(/\.(jpg|jpeg|png|gif)$/)) {
		return ['Vui lòng chọn tệp ảnh!'];
	}
    //check unique 
    const cate = await repo.findOne({
      name: name
    });

    if(cate) {
      return ['Tên loại sản phẩm đã tồn tại'];
    }

	return true;
}