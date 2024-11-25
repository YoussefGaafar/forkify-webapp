// This View will be the like the Parent (Base) Class of both ResultsView and BookmarksView in rendering their markup, because they both have the same markUp. So this class will generate only one Preview element in the _generateMarkupPreview() method

import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PreviewView extends View {
  _parentElement = '';

  _generateMarkup() {
    const id = window.location.hash.slice(1); // Getting the hash of the page URL
    return `
        <li class="preview">
            <a class="preview__link ${
              this._data.id === id ? 'preview__link--active' : ''
            }" href="#${this._data.id}">
                <figure class="preview__fig">
                 <img src="${this._data.image}" alt="Image"/>
                </figure>
                <div class="preview__data">
                  <h4 class="preview__title">${this._data.title}</h4>
                  <p class="preview__publisher">${this._data.publisher}</p>
                  <div class="preview__user-generated ${
                    this._data.key ? '' : 'hidden'
                  }">
                    <svg>
                      <use href="${icons}#icon-user"></use>
                    </svg>
                  </div>
                </div>
            </a>
        </li>
        `;
  }

  //   _generateMarkupPreview(result) {
  //     const id = window.location.hash.slice(1); // Getting the hash of the page URL
  //     return `
  //     <li class="preview">
  //         <a class="preview__link ${
  //           result.id === id ? 'preview__link--active' : ''
  //         }" href="#${result.id}">
  //             <figure class="preview__fig">
  //              <img src="${result.image}" alt="Test" />
  //             </figure>
  //             <div class="preview__data">
  //              <h4 class="preview__title">${result.title}</h4>
  //              <p class="preview__publisher">${result.publisher}</p>
  //             </div>
  //         </a>
  //     </li>
  //     `;
  //   }
}

export default new PreviewView();
