// This pagenationView class will be used to display the pagination buttons in the sidebar

import View from './View.js';
import icons from 'url:../../../assets/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      // Event Delegation
      const btn = e.target.closest('.btn--inline'); // Getting the closest clicked button (next btn OR previous btn), because we might click on the span
      if (!btn) return;

      const goToPage = +btn.dataset.goto; // Converting it to a Number
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;

    // 1. Computing how many pages there are
    const numPages = Math.ceil(
      this._data.results.length / this._data.resutlsPerPage
    );

    // 2. Currently on Page 1, and there are other pages
    if (currentPage === 1 && numPages > 1) {
      return `
       <button data-goto="${
         currentPage + 1
       }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
    }

    // 3. Currently on Last page
    if (currentPage === numPages && numPages > 1) {
      return `
        <button data-goto="${
          currentPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}g#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
        </button>
      `;
    }

    // 4. Currently on Other Page (Like page 2 and there are page 3, page 4, ...)
    if (currentPage < numPages) {
      return `
        <button data-goto="${
          currentPage - 1
        }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}g#icon-arrow-left"></use>
          </svg>
            <span>Page ${currentPage - 1}</span>
        </button>
        <button data-goto="${
          currentPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
             <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
             </svg>
        </button>
      `;
    }

    // 5. Currently on Page 1, and there are NO other pages
    return '';
  }
}

export default new PaginationView();
