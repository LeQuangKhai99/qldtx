export default function paginate(currentPage, totalPage, url) {
	let html = `<nav aria-label="Page navigation example">
	<ul class="pagination">`;
	
	if(totalPage > 1) {
		if(totalPage > 4) {
			html += `<li class="page-item"><a class="page-link" href="${url}?page=0"><<</a></li>`;
			html += `<li class="page-item ${currentPage == 0 ? 'disabled' : ''}"><a class="page-link"  href="${url}?page=${currentPage - 1}"><</a></li>`;
			html += `<li class="page-item ${currentPage == 0 ? 'disabled' : ''}"><a class="page-link  ${currentPage == 0 ? 'actived' : ''}" href="${url}?page=${0}">${0}</a></li>`;
			html += `<li class="page-item ${currentPage == 1 ? 'disabled' : ''}"><a class="page-link  ${currentPage == 1 ? 'actived' : ''}" href="${url}?page=${1}">${1}</a></li>`;

			html += `<li class="page-item disabled"><a class="page-link" href="#">...</a></li>`;
			if(currentPage != 0 && currentPage != 1 && currentPage != totalPage-1 && currentPage != totalPage-2){
				html += `<li class="page-item active"><button class="page-link" href="${url}?page=0">${currentPage}</button></li>`;
				html += `<li class="page-item disabled"><a class="page-link" href="#">...</a></li>`;
			}

			html += `<li class="page-item ${currentPage == totalPage - 2 ? 'disabled' : ''}"><a class="page-link  ${currentPage == totalPage - 2 ? 'actived' : ''}" href="${url}?page=${totalPage - 2}">${totalPage - 2}</a></li>`;
			html += `<li class="page-item ${currentPage == totalPage - 1 ? 'disabled' : ''}"><a class="page-link  ${currentPage == totalPage - 1 ? 'actived' : ''}" href="${url}?page=${totalPage - 1}">${totalPage - 1}</a></li>`;
			html += `<li class="page-item ${currentPage == totalPage - 1 ? 'disabled' : ''}"><a class="page-link" href="${url}?page=${parseInt(currentPage) + 1}">></a></li>`;
			html += `<li class="page-item"><a class="page-link"  href="${url}?page=${totalPage - 1}">>></a></li>`;
		}
		else {
			html += `<li class="page-item"><a class="page-link" href="${url}?page=0"><<</a></li>`;
			html += `<li class="page-item ${currentPage == 0 ? 'disabled' : ''}" "><a class="page-link" href="${url}?page=${parseInt(currentPage) - 1}"><</a></li>`;
			for(let i = 0; i < totalPage; i++) {
				html += `<li class="page-item ${currentPage == i ? 'disabled' : ''}"><a class="page-link  ${currentPage == i ? 'actived' : ''}" href="${url}?page=${i}">${i}</a></li>`;
			}
			html += `<li class="page-item ${currentPage == totalPage - 1 ? 'disabled' : ''}""><a class="page-link" href="${url}?page=${parseInt(currentPage) + 1}">></a></li>`;
			html += `<li class="page-item"><a class="page-link"  href="${url}?page=${totalPage - 1}">>></a></li>`;
		}
	}
	html += `</ul></nav>`;
	return html;
}