import { extname } from "path";

export const customFileName = (req, file, callback) => {
	const name = file.originalname.split('.')[0];
	const fileExtName = extname(file.originalname);
	const randomName = Array(10)
	  .fill(null)
	  .map(() => Math.round(Math.random() * 16).toString(16))
	  .join('');
	callback(null, `${name}-${randomName}-${Date.now()}${fileExtName}`);
  };