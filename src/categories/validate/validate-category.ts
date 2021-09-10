export default async function validate(name, repo, id = -1) {
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
    //check unique 
    const cate = await repo.findOne({
      name: name
    });

    if(cate) {
      return ['Tên loại sản phẩm đã tồn tại'];
    }

	return true;
}