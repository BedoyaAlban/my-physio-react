import React from 'react';
// Composant Pagination
const Pagination = ({currentPage, itemsPerPage, length, onPageChanged}) => {
    // Permet d'obtenir un nombre sans virgule
    const pagesCount = Math.ceil(length / itemsPerPage);
    const pages = [];

    //Boucle pour la pagination
    for (let i = 1; i <= pagesCount; i++) {
        pages.push(i);
    }

    return ( 
    <div id="pagination">
        <ul className="pagination pagination-sm">
            <li className={"page-item" + (currentPage === 1 && " disabled")}>
                <button className="page-link" onClick={() => onPageChanged(currentPage - 1)}>&laquo;</button>
            </li>
            {pages.map(page => (
                <li 
                    key={page} 
                    className={"page-item" + (currentPage === page && " active")}>
                    <button className="page-link" onClick={() => onPageChanged(page)}>
                        {page}
                    </button>
                </li>
            ))}
            <li className={"page-item" + (currentPage === pagesCount && " disabled")}>
                <button className="page-link" onClick={() => onPageChanged(currentPage + 1)}>&raquo;</button>
            </li>
        </ul>
    </div> );
};

Pagination.getData = (items, currentPage, itemsPerPage) => {
    const start = currentPage * itemsPerPage - itemsPerPage;
    return items.slice(start, start + itemsPerPage);
}
 
export default Pagination;